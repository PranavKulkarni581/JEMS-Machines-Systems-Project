package com.jems.projectmanagement.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "task_files")

// 🔥 Compound index for faster search by machine + task
@CompoundIndex(name = "machine_task_idx",
        def = "{'machineId': 1, 'taskId': 1}")
public class TaskFile {

    @Id
    private String id;

    // 🔹 For searching
    @Indexed
    private String machineId;

    @Indexed
    private String taskId;

    // 🔹 File details
    private String fileName;
    private String fileUrl;
    private String fileType;
    private long fileSize;

    // 🔹 Uploaded by
    private String uploadedByUserId;
    private String uploadedByName;
    private String uploadedByRole; // ADMIN or MANAGER

    // 🔹 Upload timestamp
    @CreatedDate
    private LocalDateTime uploadedAt;
}
