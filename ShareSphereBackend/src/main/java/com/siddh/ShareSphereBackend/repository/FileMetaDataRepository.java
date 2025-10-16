package com.siddh.ShareSphereBackend.repository;


import com.siddh.ShareSphereBackend.document.FileMetaDataDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;


public interface FileMetaDataRepository extends MongoRepository<FileMetaDataDocument,String> {

    //list of files
    List<FileMetaDataDocument>findByClerkId(String clerkId);

    //find how many files are uploaded for particular user
    Long countByClerkId(String clerkId);
}
