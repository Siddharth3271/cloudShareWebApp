package com.siddh.ShareSphereBackend.controller;

import com.siddh.ShareSphereBackend.document.ProfileDocument;
import com.siddh.ShareSphereBackend.dto.PaymentDTO;
import com.siddh.ShareSphereBackend.dto.PaymentVerificationDTO;
import com.siddh.ShareSphereBackend.service.PaymentService;
import com.siddh.ShareSphereBackend.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/payments")
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody PaymentDTO paymentDTO){
        //call service method to create the order
        PaymentDTO response =paymentService.createOrder(paymentDTO);

        if(response.getSuccess()){
            return ResponseEntity.ok(response);
        }
        else{
            return ResponseEntity.badRequest().body(response);
        }

    }



    @PostMapping("/verify-payment")
    public ResponseEntity<PaymentDTO> verifyPayment(@RequestBody PaymentVerificationDTO request){
        //use service method
        PaymentDTO response=paymentService.verifyPayment(request);

        if(response.getSuccess()){
            return ResponseEntity.ok(response);
        }
        else{
            return ResponseEntity.badRequest().body(response);
        }
    }
}
