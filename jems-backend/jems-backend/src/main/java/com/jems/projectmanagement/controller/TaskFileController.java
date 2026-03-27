//package com.jems.projectmanagement.controller;
//
//import com.jems.projectmanagement.model.TaskFile;
//import com.jems.projectmanagement.repository.TaskFileRepository;
//import com.jems.projectmanagement.service.CloudinaryService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.Authentication;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.time.LocalDateTime;
//import java.util.Comparator;
//import java.util.List;
//import java.util.Map;
//
//@RestController
//@RequestMapping("/files")
//@RequiredArgsConstructor
//@CrossOrigin
//public class TaskFileController {
//
//    private final CloudinaryService cloudinaryService;
//    private final TaskFileRepository taskFileRepository;
//
//    // =========================
//    // 🔥 UPLOAD FILE
//    // =========================
//    @PostMapping("/upload")
//    public ResponseEntity<?> uploadFile(
//            @RequestParam("file") MultipartFile file,
//            @RequestParam("machineId") String machineId,
//            @RequestParam(value = "taskId", required = false) String taskId,
//            Authentication authentication
//    ) throws Exception {
//
//        if (authentication == null) {
//            return ResponseEntity.status(403).body("Unauthorized");
//        }
//
//        String username = authentication.getName();
//        String role = authentication.getAuthorities()
//                .stream()
//                .findFirst()
//                .map(a -> a.getAuthority().replace("ROLE_", ""))
//                .orElse("USER");
//
//        Map<?, ?> uploadResult = cloudinaryService.uploadFile(
//                file,
//                machineId,
//                taskId != null ? taskId : "general",
//                role
//        );
//
//        TaskFile taskFile = TaskFile.builder()
//                .machineId(machineId)
//                .taskId(taskId)
//                .fileName(file.getOriginalFilename())
//                .fileUrl(uploadResult.get("secure_url").toString())
//                .fileType(file.getContentType())
//                .fileSize(file.getSize())
//                .uploadedByUserId(username)
//                .uploadedByName(username)
//                .uploadedByRole(role)
//                .uploadedAt(LocalDateTime.now())
//                .build();
//
//        taskFileRepository.save(taskFile);
//
//        return ResponseEntity.ok(taskFile);
//    }
//
//    // =========================
//    // 🔥 GET FILES
//    // =========================
//    @GetMapping
//    public ResponseEntity<List<TaskFile>> getFiles(
//            @RequestParam String machineId,
//            @RequestParam(required = false) String taskId
//    ) {
//
//        List<TaskFile> files;
//
//        if (taskId != null && !taskId.trim().isEmpty()) {
//            files = taskFileRepository.findByMachineIdAndTaskId(machineId, taskId);
//        } else {
//            files = taskFileRepository.findByMachineId(machineId);
//        }
//
//        // Safe sorting (Admin first)
//        files.sort(Comparator.comparing(
//                f -> !"ADMIN".equalsIgnoreCase(
//                        f.getUploadedByRole() == null ? "" : f.getUploadedByRole()
//                )
//        ));
//
//        return ResponseEntity.ok(files);
//    }
//
//    // =========================
//    // 🔥 DELETE FILE
//    // =========================
//    @DeleteMapping("/{id}")
//    public ResponseEntity<?> deleteFile(@PathVariable String id) {
//
//        TaskFile file = taskFileRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("File not found"));
//
//        try {
//            String fileUrl = file.getFileUrl();
//
//            // SAFE publicId extraction
//            String[] parts = fileUrl.split("/upload/");
//            if (parts.length > 1) {
//                String afterUpload = parts[1];
//                String publicId = afterUpload.substring(0, afterUpload.lastIndexOf("."));
//                cloudinaryService.deleteFile(publicId);
//            }
//
//        } catch (Exception e) {
//            System.out.println("Cloudinary delete failed: " + e.getMessage());
//        }
//
//        taskFileRepository.deleteById(id);
//
//        return ResponseEntity.ok("File deleted successfully");
//    }
//}
