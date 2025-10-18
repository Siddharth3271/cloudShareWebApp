package com.siddh.ShareSphereBackend.controller;

import com.siddh.ShareSphereBackend.document.ProfileDocument;
import com.siddh.ShareSphereBackend.dto.PaymentTransactionDTO;
import com.siddh.ShareSphereBackend.repository.PaymentTransactionRepository;
import com.siddh.ShareSphereBackend.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final PaymentTransactionRepository paymentTransactionRepository;
    private final ProfileService profileService;

    @GetMapping
    public ResponseEntity<?>getUserTransactions(){
        ProfileDocument currentProfile=profileService.getCurrentProfile();
        String clerkId=currentProfile.getClerkId();
        List<PaymentTransactionDTO>transactions=paymentTransactionRepository.findByClerkIdAndStatusOrderByTransactionDateDesc(clerkId,"SUCCESS");

        return ResponseEntity.ok(transactions);
    }

}
