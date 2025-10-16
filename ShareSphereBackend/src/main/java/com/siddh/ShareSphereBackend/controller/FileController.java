package com.siddh.ShareSphereBackend.controller;

import com.siddh.ShareSphereBackend.document.FileMetaDataDocument;
import com.siddh.ShareSphereBackend.document.UserCredits;
import com.siddh.ShareSphereBackend.dto.FileMetaDataDTO;
import com.siddh.ShareSphereBackend.repository.FileMetaDataRepository;
import com.siddh.ShareSphereBackend.service.FileMetaDataService;
import com.siddh.ShareSphereBackend.service.UserCreditsService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/files")
public class FileController {

    private final FileMetaDataService fileMetaDataService;
    private final UserCreditsService userCreditsService;
    private final FileMetaDataRepository fileMetaDataRepository;

    @PostMapping("/upload")
    public ResponseEntity<?>uploadFiles(@RequestPart("files")MultipartFile files[]) throws IOException {

        Map<String,Object>response=new HashMap<>();
        List<FileMetaDataDTO> list=fileMetaDataService.uploadFiles(files);

        UserCredits finalCredits=userCreditsService.getUserCredits();

        response.put("files",list);
        response.put("remainingCredits",finalCredits.getCredits());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/my")
    public ResponseEntity<?>getFilesForCurrentUser(){
        List<FileMetaDataDTO>files=fileMetaDataService.getFiles();
        return ResponseEntity.ok(files);
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<?>getPublicFile(@PathVariable String id){
        FileMetaDataDTO file=fileMetaDataService.getPublicFile(id);
        return ResponseEntity.ok(file);
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource>download(@PathVariable String id) throws MalformedURLException {
        FileMetaDataDTO downloadableFile=fileMetaDataService.getDownloadableFile(id);
        Path path=Paths.get(downloadableFile.getFileLocation());
        Resource resource=new UrlResource(path.toUri());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename=\""+downloadableFile.getName()+"\"")
                .body(resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?>deleteFile(@PathVariable String id){
        fileMetaDataService.deleteFile(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/toggle-public")
    public ResponseEntity<?> togglePublic(@PathVariable String id){
        FileMetaDataDTO file=fileMetaDataService.togglePublic(id);
        return ResponseEntity.ok(file);
    }
}
