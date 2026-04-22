package com.jems.projectmanagement.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notifications")
public class Notification {
    
    @Id
    private String id;
    
    private String recipientId;
    private String recipientUsername;
    
    private String title;
    private String message;
    
    private NotificationType type;
    
    private String relatedMachineId;
    private String relatedMachineName;
    
    private boolean isRead = false;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    private LocalDateTime readAt;
    
    private String sentBy;
    
    public enum NotificationType {
        MACHINE_ADDED,
        TASK_ASSIGNED,
        TASK_COMPLETED,
        MACHINE_STATUS_CHANGED,
        GENERAL_NOTIFICATION
    }
}
