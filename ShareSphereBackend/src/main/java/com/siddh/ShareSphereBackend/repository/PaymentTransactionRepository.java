package com.siddh.ShareSphereBackend.repository;

import com.siddh.ShareSphereBackend.dto.PaymentTransactionDTO;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PaymentTransactionRepository extends MongoRepository<PaymentTransactionDTO,String> {
    List<PaymentTransactionDTO>findByClerkId(String clerkId);
    List<PaymentTransactionDTO>findByClerkIdOrderByTransactionDateDesc(String clerkId);
    List<PaymentTransactionDTO>findByClerkIdAndStatusOrderByTransactionDateDesc(String clerkId,String status);
}
