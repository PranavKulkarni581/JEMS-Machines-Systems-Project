package com.jems.projectmanagement.service;

import com.jems.projectmanagement.model.Machine;
import com.jems.projectmanagement.model.Notification;
import com.jems.projectmanagement.model.User;
import com.jems.projectmanagement.repository.NotificationRepository;
import com.jems.projectmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }
    
    public void sendMachineAddedNotification(Machine machine, String managerId) {
        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new RuntimeException("Manager not found"));
        
        Notification notification = new Notification();
        notification.setRecipientId(managerId);
        notification.setRecipientUsername(manager.getUsername());
        notification.setTitle("New Machine Added");
        notification.setMessage("A new machine '" + machine.getMachineName() + 
                              "' has been added and assigned to you.");
        notification.setType(Notification.NotificationType.MACHINE_ADDED);
        notification.setRelatedMachineId(machine.getMachineId());
        notification.setRelatedMachineName(machine.getMachineName());
        notification.setSentBy(machine.getCreatedBy());
        
        notificationRepository.save(notification);
    }
    
    public void sendTaskAssignedNotification(String managerId, String machineName, 
                                            String taskName, String sentBy) {
        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new RuntimeException("Manager not found"));
        
        Notification notification = new Notification();
        notification.setRecipientId(managerId);
        notification.setRecipientUsername(manager.getUsername());
        notification.setTitle("Task Assigned");
        notification.setMessage("Task '" + taskName + "' for machine '" + machineName + 
                              "' has been assigned to you.");
        notification.setType(Notification.NotificationType.TASK_ASSIGNED);
        notification.setRelatedMachineName(machineName);
        notification.setSentBy(sentBy);
        
        notificationRepository.save(notification);
    }
    
    public void sendTaskCompletedNotification(String recipientId, String machineName, 
                                             String taskName, String completedBy) {
        User recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Notification notification = new Notification();
        notification.setRecipientId(recipientId);
        notification.setRecipientUsername(recipient.getUsername());
        notification.setTitle("Task Completed");
        notification.setMessage("Task '" + taskName + "' for machine '" + machineName + 
                              "' has been completed by " + completedBy + ".");
        notification.setType(Notification.NotificationType.TASK_COMPLETED);
        notification.setRelatedMachineName(machineName);
        notification.setSentBy(completedBy);
        
        notificationRepository.save(notification);
    }
    
    public void sendMachineStatusChangedNotification(String managerId, Machine machine) {
        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new RuntimeException("Manager not found"));
        
        Notification notification = new Notification();
        notification.setRecipientId(managerId);
        notification.setRecipientUsername(manager.getUsername());
        notification.setTitle("Machine Status Changed");
        notification.setMessage("Status of machine '" + machine.getMachineName() + 
                              "' has been changed to " + machine.getStatus() + ".");
        notification.setType(Notification.NotificationType.MACHINE_STATUS_CHANGED);
        notification.setRelatedMachineId(machine.getMachineId());
        notification.setRelatedMachineName(machine.getMachineName());
        
        notificationRepository.save(notification);
    }
    
    public List<Notification> getNotificationsByUser(String userId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId);
    }
    
    public List<Notification> getUnreadNotifications(String userId) {
        return notificationRepository.findByRecipientIdAndIsReadFalse(userId);
    }
    
    public long getUnreadNotificationCount(String userId) {
        return notificationRepository.countByRecipientIdAndIsReadFalse(userId);
    }
    
    public Notification markAsRead(String notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        notification.setReadAt(LocalDateTime.now());
        return notificationRepository.save(notification);
    }
    
    public void markAllAsRead(String userId) {
        List<Notification> unreadNotifications = notificationRepository.findByRecipientIdAndIsReadFalse(userId);
        unreadNotifications.forEach(notification -> {
            notification.setRead(true);
            notification.setReadAt(LocalDateTime.now());
        });
        notificationRepository.saveAll(unreadNotifications);
    }
    
    public void deleteNotification(String notificationId) {
        notificationRepository.deleteById(notificationId);
    }
}
