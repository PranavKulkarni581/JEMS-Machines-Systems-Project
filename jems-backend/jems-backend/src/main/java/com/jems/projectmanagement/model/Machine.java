package com.jems.projectmanagement.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "machines")
public class Machine {
    
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String machineId; // Unique machine identifier
    
    private String machineName;
    private String machineType;
    private String description;
    private String clientName;
    private String clientContact;
    
    private LocalDateTime projectStartDate;
    private LocalDateTime poDate; // Purchase Order Date
    private LocalDateTime deliveryPeriod;
    
    private List<Task> tasks = new ArrayList<>();
    
    private MachineStatus status = MachineStatus.NOT_STARTED;
    
    private int overallProgress = 0;
    
    private String assignedManager;
    private String assignedManagerId;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    private String createdBy; // Admin username
    private String lastUpdatedBy;
    
    private List<String> notificationSentTo = new ArrayList<>();
    
    private boolean active = true;
    
    public enum MachineStatus {
        NOT_STARTED,
        IN_PROGRESS,
        COMPLETED,
        ON_HOLD,
        CANCELLED,
        DELIVERED
    }
    
    // Calculate overall machine progress
    public void calculateOverallProgress() {
        if (tasks == null || tasks.isEmpty()) {
            this.overallProgress = 0;
            return;
        }
        
        int totalProgress = tasks.stream()
                .mapToInt(Task::getProgressPercentage)
                .sum();
        this.overallProgress = totalProgress / tasks.size();
        
        // Update status based on progress
        if (this.overallProgress == 100) {
            this.status = MachineStatus.COMPLETED;
        } else if (this.overallProgress > 0) {
            this.status = MachineStatus.IN_PROGRESS;
        }
    }
}
