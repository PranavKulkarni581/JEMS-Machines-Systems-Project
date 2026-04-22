package com.jems.projectmanagement.dto;

import com.jems.projectmanagement.model.Machine;
import com.jems.projectmanagement.model.SubTask;
import com.jems.projectmanagement.model.Task;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
class MachineRequest {
    @NotBlank(message = "Machine ID is required")
    private String machineId;
    
    @NotBlank(message = "Machine name is required")
    private String machineName;
    
    private String machineType;
    private String description;
    private String clientName;
    private String clientContact;
    private LocalDateTime projectStartDate;
    private LocalDateTime poDate;
    private LocalDateTime deliveryPeriod;
    private String assignedManagerId;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class TaskRequest {
    @NotBlank(message = "Stage name is required")
    private String stageName;
    
    private String stageNumber;
    private String description;
    private String checkedBy;
    private String approvedBy;
    private String assignedTo;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class SubTaskRequest {
    @NotBlank(message = "Subtask name is required")
    private String name;
    
    private String description;
    private String assignedEmployee;
    private String assignedEmployeeId;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class TaskUpdateRequest {
    private String machineId;
    private String taskId;
    private String subTaskId;
    private SubTask.TaskStatus status;
    private String remarks;
    private int progressPercentage;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class MachineResponse {
    private String id;
    private String machineId;
    private String machineName;
    private String machineType;
    private String description;
    private String clientName;
    private String clientContact;
    private LocalDateTime projectStartDate;
    private LocalDateTime poDate;
    private LocalDateTime deliveryPeriod;
    private List<Task> tasks = new ArrayList<>();
    private Machine.MachineStatus status;
    private int overallProgress;
    private String assignedManager;
    private String assignedManagerId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private boolean active;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class MachineProgressResponse {
    private String machineId;
    private String machineName;
    private int overallProgress;
    private Machine.MachineStatus status;
    private int completedTasks;
    private int totalTasks;
    private LocalDateTime lastUpdated;
}
