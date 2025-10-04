package com.siddh.ShareSphereBackend.controller;

import com.siddh.ShareSphereBackend.dto.ProfileDTO;
import com.siddh.ShareSphereBackend.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;
    @PostMapping("/register")
    public ResponseEntity<?> registerProfile(@RequestBody ProfileDTO profileDTO){
        ProfileDTO savedProfile=profileService.createProfile(profileDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedProfile);
    }
}
