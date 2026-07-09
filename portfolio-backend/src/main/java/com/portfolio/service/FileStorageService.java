package com.portfolio.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;

    public FileStorageService(@Value("${app.upload.dir}") String uploadDir) {
        // Resolve upload path to absolute path
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();

        try {
            // Dynamically create upload folder if missing
            Files.createDirectories(this.fileStorageLocation);
        } catch (IOException ex) {
            throw new IllegalStateException("Could not create the upload directory: " + this.fileStorageLocation, ex);
        }
    }

    // Stores file on host disk
    public String storeFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot store an empty file.");
        }

        // Validate content type is strictly 'application/pdf' or image-based
        String contentType = file.getContentType();
        if (contentType == null || (!contentType.equals("application/pdf") && !contentType.startsWith("image/"))) {
            throw new IllegalArgumentException("Invalid file type. Only PDF and image uploads are allowed.");
        }

        // Sanitize filename to block directory traversal attacks
        String originalFilename = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        if (originalFilename.contains("..")) {
            throw new IllegalArgumentException("Invalid file name layout detected (directory traversal attempt): " + originalFilename);
        }

        // Extract extension and generate a secure unique filename with UUID
        String fileExtension = "";
        int extIndex = originalFilename.lastIndexOf('.');
        if (extIndex >= 0) {
            fileExtension = originalFilename.substring(extIndex);
        }
        String secureFileName = UUID.randomUUID().toString() + fileExtension;

        try {
            // Write payload to disk
            Path targetLocation = this.fileStorageLocation.resolve(secureFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return secureFileName;
        } catch (IOException ex) {
            throw new IllegalStateException("Could not store file " + originalFilename + ". Please try again.", ex);
        }
    }

    // Resolves and loads local files as Spring Resource objects
    public Resource loadFileAsResource(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            
            // Second level check for traversal attacks
            if (!filePath.startsWith(this.fileStorageLocation)) {
                throw new IllegalArgumentException("Unauthorized path traversal attempt outside container directory.");
            }

            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new IllegalArgumentException("File asset is missing or not readable: " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new IllegalArgumentException("File path is malformed or invalid: " + fileName, ex);
        }
    }
}
