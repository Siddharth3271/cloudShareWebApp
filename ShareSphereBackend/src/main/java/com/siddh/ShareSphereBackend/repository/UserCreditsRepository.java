package com.siddh.ShareSphereBackend.repository;

import com.siddh.ShareSphereBackend.document.UserCredits;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserCreditsRepository extends MongoRepository<UserCredits,String> {

}
