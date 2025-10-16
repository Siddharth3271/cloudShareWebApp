package com.siddh.ShareSphereBackend.service;


import com.siddh.ShareSphereBackend.document.FileMetaDataDocument;
import com.siddh.ShareSphereBackend.document.ProfileDocument;
import com.siddh.ShareSphereBackend.dto.FileMetaDataDTO;
import com.siddh.ShareSphereBackend.repository.FileMetaDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FileMetaDataService {
    private final ProfileService profileService;
    private final UserCreditsService userCreditsService;
    private final FileMetaDataRepository fileMetaDataRepository;

    public List<FileMetaDataDTO>uploadFiles(MultipartFile files[]) throws IOException {
        ProfileDocument currentProfile=profileService.getCurrentProfile();
        List<FileMetaDataDocument>savedFiles=new ArrayList<>();

        if(!userCreditsService.hasEnoughCredits(files.length)){
            throw new RuntimeException("Not Enough Credits to upload files. Please purchase more credits");
        }

        Path uploadPath=Paths.get("upload").toAbsolutePath().normalize();
        Files.createDirectories(uploadPath);

        for(MultipartFile file:files){
            String fileName=UUID.randomUUID()+"."+ StringUtils.getFilenameExtension(file.getOriginalFilename());
            Path targetLocation=uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(),targetLocation, StandardCopyOption.REPLACE_EXISTING);
            FileMetaDataDocument fileMetaData=FileMetaDataDocument.builder()
                    .fileLocation(targetLocation.toString())
                    .name(file.getOriginalFilename())
                    .size(file.getSize())
                    .type(file.getContentType())
                    .clerkId(currentProfile.getClerkId())
                    .isPublic(false)
                    .uploadedAt(LocalDateTime.now())
                    .build();

            //consume one credit for each file upload
            userCreditsService.consumeCredit();

            savedFiles.add(fileMetaDataRepository.save(fileMetaData));
        }

        return savedFiles.stream().map(fileMetaDataDocument -> mapToDTO(fileMetaDataDocument)).collect(Collectors.toList());
    }

    private FileMetaDataDTO mapToDTO(FileMetaDataDocument fileMetaDataDocument){
        return FileMetaDataDTO.builder()
                .id(fileMetaDataDocument.getId())
                .fileLocation(fileMetaDataDocument.getFileLocation())
                .name(fileMetaDataDocument.getName())
                .size(fileMetaDataDocument.getSize())
                .type(fileMetaDataDocument.getType())
                .clerkId(fileMetaDataDocument.getClerkId())
                .isPublic(fileMetaDataDocument.getIsPublic())
                .uploadedAt(fileMetaDataDocument.getUploadedAt())
                .build();
    }

    //read files of the current user
    public List<FileMetaDataDTO>getFiles(){
        ProfileDocument currentProfile=profileService.getCurrentProfile();
        List<FileMetaDataDocument> files=fileMetaDataRepository.findByClerkId(currentProfile.getClerkId());
        return files.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    //public files readability
    public FileMetaDataDTO getPublicFile(String id){
        Optional<FileMetaDataDocument>fileOptional=fileMetaDataRepository.findById(id);
        if (fileOptional.isEmpty() || !fileOptional.get().getIsPublic()) {
            throw new RuntimeException("Unable to get the file");
        }

        FileMetaDataDocument document = fileOptional.get();
        return mapToDTO(document);
    }

    //download the file
    public FileMetaDataDTO getDownloadableFile(String id){
        FileMetaDataDocument file=fileMetaDataRepository.findById(id).orElseThrow(()->new RuntimeException("File Not found"));
        return mapToDTO(file);
    }

    //delete the file
    public void deleteFile(String id){
        try {
            ProfileDocument currentProfile=profileService.getCurrentProfile();
            FileMetaDataDocument file=fileMetaDataRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("File not found"));

            if(!file.getClerkId().equals(currentProfile.getClerkId())){
               throw new RuntimeException("File doesn't belong to current user");
            }

            Path filePath=Paths.get(file.getFileLocation());
            Files.deleteIfExists(filePath);
            fileMetaDataRepository.deleteById(id);
        }
        catch(Exception e){
            throw new RuntimeException("Error Deleting the File");
        }
    }

    public FileMetaDataDTO togglePublic(String id) {
        FileMetaDataDocument file=fileMetaDataRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found"));

        file.setIsPublic(!file.getIsPublic());
        fileMetaDataRepository.save(file);
        return mapToDTO(file);
    }
}
