//package com.jems.projectmanagement.service;
//
//import com.cloudinary.Cloudinary;
//import com.cloudinary.utils.ObjectUtils;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.util.Map;
//
//@Service
//@RequiredArgsConstructor
//public class CloudinaryService {
//
//    private final Cloudinary cloudinary;
//
//    // 🔥 UPLOAD
//    public Map uploadFile(
//            MultipartFile file,
//            String machineId,
//            String taskId,
//            String role
//    ) throws Exception {
//
//        if (file.getSize() > 10 * 1024 * 1024) {
//            throw new RuntimeException("File size exceeds 10MB");
//        }
//
//        String folderPath = String.format(
//                "jems/machines/%s/%s/%s",
//                machineId,
//                taskId,
//                role.toLowerCase()
//        );
//
//        return cloudinary.uploader().upload(
//                file.getBytes(),
//                ObjectUtils.asMap(
//                        "folder", folderPath,
//                        "resource_type", "auto"
//                )
//        );
//    }
//
//    // 🔥 DELETE FROM CLOUDINARY
//    public Map deleteFile(String publicId) throws Exception {
//        return cloudinary.uploader().destroy(
//                publicId,
//                ObjectUtils.asMap("resource_type", "auto")
//        );
//    }
//}
