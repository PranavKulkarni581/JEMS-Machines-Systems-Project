package com.jems.projectmanagement.repository;

import com.jems.projectmanagement.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {
    
    List<Notification> findByRecipientId(String recipientId);
    
    List<Notification> findByRecipientIdAndIsReadFalse(String recipientId);
    
    List<Notification> findByRecipientIdOrderByCreatedAtDesc(String recipientId);
    
    long countByRecipientIdAndIsReadFalse(String recipientId);
    
    List<Notification> findByRelatedMachineId(String machineId);
}
