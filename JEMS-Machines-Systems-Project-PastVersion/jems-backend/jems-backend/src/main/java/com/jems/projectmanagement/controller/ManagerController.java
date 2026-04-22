package com.jems.projectmanagement.controller;

import com.jems.projectmanagement.model.Machine;
import com.jems.projectmanagement.model.Notification;
import com.jems.projectmanagement.model.SubTask;
import com.jems.projectmanagement.model.User;
import com.jems.projectmanagement.service.MachineService;
import com.jems.projectmanagement.service.NotificationService;
import com.jems.projectmanagement.service.UserService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/manager")
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
public class ManagerController {
    
    @Autowired
    private MachineService machineService;
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private UserService userService;
    
    // Get all machines
    @GetMapping("/machines")
    public ResponseEntity<List<Machine>> getAllMachines() {
        return ResponseEntity.ok(machineService.getAllMachines());
    }
    
    // Get machines assigned to current manager
    @GetMapping("/machines/assigned")
    public ResponseEntity<?> getAssignedMachines(Authentication authentication) {
        User user = userService.getUserByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Machine> machines = machineService.getMachinesByManager(user.getId());
        return ResponseEntity.ok(machines);
    }
    
    // Get machines by status
    @GetMapping("/machines/status/{status}")
    public ResponseEntity<List<Machine>> getMachinesByStatus(@PathVariable String status) {
        Machine.MachineStatus machineStatus = Machine.MachineStatus.valueOf(status.toUpperCase());
        return ResponseEntity.ok(machineService.getMachinesByStatus(machineStatus));
    }
    
    // Get current working machines (IN_PROGRESS)
    @GetMapping("/machines/working")
    public ResponseEntity<List<Machine>> getCurrentWorkingMachines() {
        return ResponseEntity.ok(machineService.getMachinesByStatus(Machine.MachineStatus.IN_PROGRESS));
    }
    
    // Get machine details
    @GetMapping("/machines/{machineId}")
    public ResponseEntity<?> getMachineDetails(@PathVariable String machineId) {
        try {
            Machine machine = machineService.getMachineByMachineId(machineId);
            return ResponseEntity.ok(machine);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Update subtask status and progress
    @PutMapping("/machines/{machineId}/tasks/{taskId}/subtasks/{subTaskId}")
    public ResponseEntity<?> updateSubTaskStatus(@PathVariable String machineId,
                                                 @PathVariable String taskId,
                                                 @PathVariable String subTaskId,
                                                 @RequestBody TaskUpdateRequest request,
                                                 Authentication authentication) {
        try {
            Machine updated = machineService.updateSubTaskStatus(
                    machineId,
                    taskId,
                    subTaskId,
                    request.getStatus(),
                    request.getRemarks(),
                    request.getProgressPercentage(),
                    authentication.getName()
            );
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    // Mark subtask as complete
    @PutMapping("/machines/{machineId}/tasks/{taskId}/subtasks/{subTaskId}/complete")
    public ResponseEntity<?> completeSubTask(@PathVariable String machineId,
                                            @PathVariable String taskId,
                                            @PathVariable String subTaskId,
                                            @RequestBody(required = false) CompleteTaskRequest request,
                                            Authentication authentication) {
        try {
            String remarks = request != null ? request.getRemarks() : "";
            Machine updated = machineService.updateSubTaskStatus(
                    machineId,
                    taskId,
                    subTaskId,
                    SubTask.TaskStatus.COMPLETED,
                    remarks,
                    100,
                    authentication.getName()
            );
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    // Get overall progress
    @GetMapping("/progress")
    public ResponseEntity<?> getOverallProgress(Authentication authentication) {
        User user = userService.getUserByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Machine> machines = machineService.getMachinesByManager(user.getId());
        return ResponseEntity.ok(machines);
    }
    
    // Get specific machine progress
    @GetMapping("/progress/{machineId}")
    public ResponseEntity<?> getMachineProgress(@PathVariable String machineId) {
        try {
            Machine machine = machineService.getMachineByMachineId(machineId);
            return ResponseEntity.ok(machine);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Notifications
    @GetMapping("/notifications")
    public ResponseEntity<?> getNotifications(Authentication authentication) {
        User user = userService.getUserByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Notification> notifications = notificationService.getNotificationsByUser(user.getId());
        return ResponseEntity.ok(notifications);
    }
    
    @GetMapping("/notifications/unread")
    public ResponseEntity<?> getUnreadNotifications(Authentication authentication) {
        User user = userService.getUserByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Notification> notifications = notificationService.getUnreadNotifications(user.getId());
        return ResponseEntity.ok(notifications);
    }
    
    @GetMapping("/notifications/count")
    public ResponseEntity<?> getUnreadNotificationCount(Authentication authentication) {
        User user = userService.getUserByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        long count = notificationService.getUnreadNotificationCount(user.getId());
        return ResponseEntity.ok(new NotificationCountResponse(count));
    }
    
    @PutMapping("/notifications/{notificationId}/read")
    public ResponseEntity<?> markNotificationAsRead(@PathVariable String notificationId) {
        try {
            Notification notification = notificationService.markAsRead(notificationId);
            return ResponseEntity.ok(notification);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/notifications/mark-all-read")
    public ResponseEntity<?> markAllNotificationsAsRead(Authentication authentication) {
        User user = userService.getUserByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        notificationService.markAllAsRead(user.getId());
        return ResponseEntity.ok(new MessageResponse("All notifications marked as read"));
    }
    
    // Inner classes for requests and responses
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    static class TaskUpdateRequest {
        private SubTask.TaskStatus status;
        private String remarks;
        private int progressPercentage;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    static class CompleteTaskRequest {
        private String remarks;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    static class MessageResponse {
        private String message;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    static class NotificationCountResponse {
        private long count;
    }
}
