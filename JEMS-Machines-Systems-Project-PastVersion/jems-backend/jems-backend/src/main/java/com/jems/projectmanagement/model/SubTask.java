package com.jems.projectmanagement.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubTask {
    
    private String id;
    private String name;
    private String description;
    private String assignedEmployee;
    private String assignedEmployeeId;
    private TaskStatus status = TaskStatus.PENDING;
    private String remarks;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime completedAt;
    private String completedBy;
    private int progressPercentage = 0;
    
    public enum TaskStatus {
        PENDING,
        IN_PROGRESS,
        COMPLETED,
        ON_HOLD,
        CANCELLED
    }
}
