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
    // Calculate overall machine progress
    public void calculateOverallProgress() {

        // If no tasks exist
        if (tasks == null || tasks.isEmpty()) {
            this.overallProgress = 0;
            this.status = MachineStatus.NOT_STARTED;
            return;
        }

        // 🔢 Calculate average progress from tasks
        int totalProgress = tasks.stream()
                .mapToInt(Task::getProgressPercentage)
                .sum();

        this.overallProgress = totalProgress / tasks.size();

        // 🚨 IMPORTANT: Do not override DELIVERED status
        if (this.status == MachineStatus.DELIVERED) {
            return;
        }

        // ✅ Correct status logic based on TASK STATUS (not percentage)

        boolean allTasksCompleted = tasks.stream()
                .allMatch(task -> task.getStatus() == Task.TaskStatus.COMPLETED);

        boolean anyTaskInProgress = tasks.stream()
                .anyMatch(task -> task.getStatus() == Task.TaskStatus.IN_PROGRESS);

        boolean anyTaskOnHold = tasks.stream()
                .anyMatch(task -> task.getStatus() == Task.TaskStatus.ON_HOLD);

        if (allTasksCompleted) {
            this.status = MachineStatus.COMPLETED;
        }
        else if (anyTaskInProgress || anyTaskOnHold) {
            // If at least one task started but not all completed
            this.status = MachineStatus.IN_PROGRESS;
        }
        else {
            this.status = MachineStatus.NOT_STARTED;
        }
    }


}