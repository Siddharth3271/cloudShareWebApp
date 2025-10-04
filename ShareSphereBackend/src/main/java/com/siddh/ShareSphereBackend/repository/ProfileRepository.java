package com.siddh.ShareSphereBackend.repository;

import com.siddh.ShareSphereBackend.document.ProfileDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ProfileRepository extends MongoRepository<ProfileDocument,String> {

    Optional<ProfileDocument> findByEmail(String email);

    ProfileDocument findByClerkID(String clerkId);
}
