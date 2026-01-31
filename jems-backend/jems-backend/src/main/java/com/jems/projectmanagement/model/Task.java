package com.jems.projectmanagement.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Task {
    
    private String id;
    private String stageName; // Design, DAP, Final Design/Drafting, etc.
    private String stageNumber; // 1, 2, 3, etc.
    private String description;
    private List<SubTask> subTasks = new ArrayList<>();
    private TaskStatus status = TaskStatus.PENDING;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String checkedBy;
    private String approvedBy;
    private String assignedTo; // Manager or designer name
    private String remarks;
    private int progressPercentage = 0;
    
    public enum TaskStatus {
        PENDING,
        IN_PROGRESS,
        COMPLETED,
        ON_HOLD,
        CANCELLED
    }
    
    // Calculate overall progress based on subtasks
    public void calculateProgress() {
        if (subTasks == null || subTasks.isEmpty()) {
            this.progressPercentage = 0;
            return;
        }
        
        int totalProgress = subTasks.stream()
                .mapToInt(SubTask::getProgressPercentage)
                .sum();
        this.progressPercentage = totalProgress / subTasks.size();
        
        // Update status based on progress
        if (this.progressPercentage == 100) {
            this.status = TaskStatus.COMPLETED;
        } else if (this.progressPercentage > 0) {
            this.status = TaskStatus.IN_PROGRESS;
        }
    }
}
