package com.jems.projectmanagement.controller;

import com.jems.projectmanagement.model.TaskFile;
import com.jems.projectmanagement.repository.TaskFileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/files")
@RequiredArgsConstructor
@CrossOrigin
public class TaskFileController {

    private final TaskFileRepository taskFileRepository;

    // 🔥 Upload folder path from application.properties
    @Value("${file.upload-dir}")
    private String uploadDir;

    // =========================
    // 🔥 UPLOAD FILE
    // =========================
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("machineId") String machineId,
            @RequestParam(value = "taskId", required = false) String taskId,
            Authentication authentication
    ) throws Exception {

        if (authentication == null) {
            return ResponseEntity.status(403).body("Unauthorized");
        }

        String username = authentication.getName();
        String role = authentication.getAuthorities()
                .stream()
                .findFirst()
                .map(a -> a.getAuthority().replace("ROLE_", ""))
                .orElse("USER");

        // 🔥 CREATE DIRECTORY IF NOT EXISTS
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // 🔥 UNIQUE FILE NAME
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

        Path filePath = uploadPath.resolve(fileName);

        // 🔥 SAVE FILE LOCALLY
        Files.write(filePath, file.getBytes());

        // 🔥 FILE URL (IMPORTANT)
        String fileUrl = "/uploads/" + fileName;

        TaskFile taskFile = TaskFile.builder()
                .machineId(machineId)
                .taskId(taskId)
                .fileName(file.getOriginalFilename())
                .fileUrl(fileUrl)
                .fileType(file.getContentType())
                .fileSize(file.getSize())
                .uploadedByUserId(username)
                .uploadedByName(username)
                .uploadedByRole(role)
                .uploadedAt(LocalDateTime.now())
                .build();

        taskFileRepository.save(taskFile);

        return ResponseEntity.ok(taskFile);
    }

    // =========================
    // 🔥 GET FILES
    // =========================
    @GetMapping
    public ResponseEntity<List<TaskFile>> getFiles(
            @RequestParam String machineId,
            @RequestParam(required = false) String taskId
    ) {

        List<TaskFile> files;

        if (taskId != null && !taskId.trim().isEmpty()) {
            files = taskFileRepository.findByMachineIdAndTaskId(machineId, taskId);
        } else {
            files = taskFileRepository.findByMachineId(machineId);
        }

        // Admin first sorting
        files.sort(Comparator.comparing(
                f -> !"ADMIN".equalsIgnoreCase(
                        f.getUploadedByRole() == null ? "" : f.getUploadedByRole()
                )
        ));

        return ResponseEntity.ok(files);
    }

    // =========================
    // 🔥 DELETE FILE
    // =========================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFile(@PathVariable String id) {

        TaskFile file = taskFileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found"));

        try {
            // 🔥 DELETE FILE FROM LOCAL STORAGE
            Path filePath = Paths.get(uploadDir, Paths.get(file.getFileUrl()).getFileName().toString());
            Files.deleteIfExists(filePath);

        } catch (IOException e) {
            System.out.println("Local file delete failed: " + e.getMessage());
        }

        taskFileRepository.deleteById(id);

        return ResponseEntity.ok("File deleted successfully");
    }
}