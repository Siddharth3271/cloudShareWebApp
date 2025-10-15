package com.siddh.ShareSphereBackend.service;

import com.siddh.ShareSphereBackend.document.UserCredits;
import com.siddh.ShareSphereBackend.repository.UserCreditsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserCreditsService {
    private final UserCreditsRepository userCreditsRepository;

    public UserCredits createInitialCredits(String clerkId){
        UserCredits userCredits=UserCredits.builder()
                .clerkId(clerkId)
                .credits(5)
                .plan("BASIC")
                .build();

        return userCreditsRepository.save(userCredits);
    }
}
