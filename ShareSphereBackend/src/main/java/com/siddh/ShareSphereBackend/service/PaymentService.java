package com.siddh.ShareSphereBackend.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.siddh.ShareSphereBackend.document.ProfileDocument;
import com.siddh.ShareSphereBackend.dto.PaymentDTO;
import com.siddh.ShareSphereBackend.dto.PaymentTransactionDTO;
import com.siddh.ShareSphereBackend.dto.PaymentVerificationDTO;
import com.siddh.ShareSphereBackend.repository.PaymentTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.siddh.ShareSphereBackend.service.UserCreditsService;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Formatter;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final ProfileService profileService;
    private final UserCreditsService userCreditsService;
    private final PaymentTransactionRepository paymentTransactionRepository;

    @Value("${razorpay.key.id}")
    private String razorpayKey;

    @Value("${razorpay.key.secret}")
    private String razorpaySecret;

    public PaymentDTO createOrder(PaymentDTO paymentDTO){
        try{
            ProfileDocument currentProfile=profileService.getCurrentProfile();
            String clerkId=currentProfile.getClerkId();


            RazorpayClient razorpayClient=new RazorpayClient(razorpayKey,razorpaySecret);
            JSONObject orderRequest=new JSONObject();
            orderRequest.put("amount",paymentDTO.getAmount());
            orderRequest.put("currency",paymentDTO.getCurrency());
            orderRequest.put("receipt","order_"+System.currentTimeMillis());

            Order order=razorpayClient.orders.create(orderRequest);
            String orderId=order.get("id");

            //create pending transaction record
            PaymentTransactionDTO transactionDTO=PaymentTransactionDTO.builder()
                    .clerkId(clerkId)
                    .orderId(orderId)
                    .planId(paymentDTO.getPlanId())
                    .amount(paymentDTO.getAmount())
                    .currency(paymentDTO.getCurrency())
                    .status("PENDING")
                    .transactionDate(LocalDateTime.now())
                    .userEmail(currentProfile.getEmail())
                    .userName(currentProfile.getFirstName()+" "+currentProfile.getLastName())
                    .build();

            paymentTransactionRepository.save(transactionDTO);

            return PaymentDTO.builder()
                    .orderId(orderId)
                    .success(true)
                    .message("order created successfully!!")
                    .build();
        }
        catch(Exception e){
            return PaymentDTO.builder()
                    .success(false)
                    .message("Error creating Order!!!: "+e.getMessage())
                    .build();
        }
    }

    public PaymentDTO verifyPayment(PaymentVerificationDTO request){
        try{
            ProfileDocument currentProfile=profileService.getCurrentProfile();
            String clerkId=currentProfile.getClerkId();

//            System.out.println("=== VERIFY PAYMENT START ===");
//            System.out.println("Order ID (from frontend): " + request.getRazorpay_order_id());
//            System.out.println("Payment ID (from frontend): " + request.getRazorpay_payment_id());
//            System.out.println("Signature (from frontend): " + request.getRazorpay_signature());
//            System.out.println("Plan ID: " + request.getPlanId());
//            System.out.println("Using Secret: " + razorpaySecret.substring(0, Math.min(4, razorpaySecret.length())) + "****");

            String data=request.getRazorpay_order_id()+"|"+request.getRazorpay_payment_id();
            String generatedSignature=generateHmacSha256Signature(data,razorpaySecret);

//            System.out.println("Generated Signature (backend): " + generatedSignature);
//            System.out.println("Received Signature (frontend): " + request.getRazorpay_signature());
//            System.out.println("=== SIGNATURE COMPARISON RESULT ===");
//            System.out.println("Match? " + generatedSignature.trim().equals(request.getRazorpay_signature().trim()));
//            System.out.println("==================================");


            if(!generatedSignature.equals(request.getRazorpay_signature())){
                updateTransactionStatus(request.getRazorpay_order_id(),"FAILED",request.getRazorpay_payment_id(),null);
                return PaymentDTO.builder()
                        .success(false)
                        .message("Payment Signature Verification Failed")
                        .build();
            }

            //add credits based on plan
            int creditsToAdd=0;
            String plan="BASIC";
            switch(request.getPlanId()){
                case "premium":
                    creditsToAdd=500;
                    plan="PREMIUM";
                    break;
                case "ultimate":
                    creditsToAdd=4000;
                    plan="ULTIMATE";
                    break;
            }

            if(creditsToAdd>0){
                userCreditsService.addCredits(clerkId,creditsToAdd,plan);
                updateTransactionStatus(request.getRazorpay_order_id(),"SUCCESS", request.getRazorpay_payment_id(), creditsToAdd);

                System.out.println("✅ Credits added successfully: " + creditsToAdd);
                System.out.println("=== VERIFY PAYMENT END ===");

                return PaymentDTO.builder()
                        .success(true)
                        .message("Payment Verified and credits added successfully")
                        .credits(userCreditsService.getUserCredits(clerkId).getCredits())
                        .build();
            }
            else{
                updateTransactionStatus(request.getRazorpay_order_id(),"FAILED", request.getRazorpay_payment_id(), null);
                return PaymentDTO.builder()
                        .success(false)
                        .message("Invalid plan selected")
                        .build();
            }
        }
        catch(Exception e){
            try{
                updateTransactionStatus(request.getRazorpay_order_id(),"ERROR",request.getRazorpay_payment_id(),null);
            } catch (Exception ex) {
                throw new RuntimeException(ex);
            }
//            System.out.println("Error Verifying payment: " + e.getMessage());
//            e.printStackTrace();

            return PaymentDTO.builder()
                    .success(false)
                    .message("Error Verifying payment: "+e.getMessage())
                    .build();
        }
    }

    //Generate HMAC SHA256 signature for payment verification
    private String generateHmacSha256Signature(String data, String secret) throws NoSuchAlgorithmException, InvalidKeyException {
        SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(), "HmacSHA256");
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(secretKey);
        byte[] hmacData = mac.doFinal(data.getBytes());
        return toHexString(hmacData);
    }
    private String toHexString(byte[] bytes) {
        Formatter formatter = new Formatter();
        for (byte b : bytes) {
            formatter.format("%02x", b);
        }
        String result = formatter.toString();
        formatter.close();
        return result;
    }

    private void updateTransactionStatus(String razorpayOrderId, String status, String razorpayPaymentId, Integer creditsToAdd) {
        paymentTransactionRepository.findAll().stream()
                .filter(t->t.getOrderId()!=null && t.getOrderId().equals(razorpayOrderId))
                .findFirst()
                .map(transaction->{
                    transaction.setStatus(status);
                    transaction.setPaymentId(razorpayPaymentId);
                    if(creditsToAdd!=null){
                        transaction.setCreditsAdded(creditsToAdd);
                    }
                    return paymentTransactionRepository.save(transaction);
                })
                .orElse(null);
    }


}
