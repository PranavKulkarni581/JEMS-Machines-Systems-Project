package com.jems.projectmanagement.service;

import com.jems.projectmanagement.model.Machine;
import com.jems.projectmanagement.model.SubTask;
import com.jems.projectmanagement.model.Task;
import com.jems.projectmanagement.model.User;
import com.jems.projectmanagement.repository.MachineRepository;
import com.jems.projectmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class MachineService {
    
    @Autowired
    private MachineRepository machineRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    public Machine createMachine(Machine machine, String createdBy) {
        if (machineRepository.existsByMachineId(machine.getMachineId())) {
            throw new RuntimeException("Machine ID already exists");
        }
        
        machine.setCreatedBy(createdBy);
        machine.setStatus(Machine.MachineStatus.NOT_STARTED);
        machine.setOverallProgress(0);
        
        // Set manager details if assigned
        if (machine.getAssignedManagerId() != null) {
            Optional<User> manager = userRepository.findById(machine.getAssignedManagerId());
            manager.ifPresent(user -> machine.setAssignedManager(user.getUsername()));
        }
        
        Machine savedMachine = machineRepository.save(machine);
        
        // Send notification to assigned manager
        if (machine.getAssignedManagerId() != null) {
            notificationService.sendMachineAddedNotification(savedMachine, machine.getAssignedManagerId());
        }
        
        return savedMachine;
    }
    
    public Machine addTaskToMachine(String machineId, Task task) {
        Machine machine = machineRepository.findByMachineId(machineId)
                .orElseThrow(() -> new RuntimeException("Machine not found"));
        
        task.setId(UUID.randomUUID().toString());
        machine.getTasks().add(task);
        machine.calculateOverallProgress();
        
        return machineRepository.save(machine);
    }
    
    public Machine addSubTaskToTask(String machineId, String taskId, SubTask subTask) {
        Machine machine = machineRepository.findByMachineId(machineId)
                .orElseThrow(() -> new RuntimeException("Machine not found"));
        
        Task task = machine.getTasks().stream()
                .filter(t -> t.getId().equals(taskId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Task not found"));
        
        subTask.setId(UUID.randomUUID().toString());
        task.getSubTasks().add(subTask);
        task.calculateProgress();
        machine.calculateOverallProgress();
        
        return machineRepository.save(machine);
    }
    
    public Machine updateSubTaskStatus(String machineId, String taskId, String subTaskId, 
                                      SubTask.TaskStatus status, String remarks, 
                                      int progressPercentage, String updatedBy) {
        Machine machine = machineRepository.findByMachineId(machineId)
                .orElseThrow(() -> new RuntimeException("Machine not found"));
        
        Task task = machine.getTasks().stream()
                .filter(t -> t.getId().equals(taskId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Task not found"));
        
        SubTask subTask = task.getSubTasks().stream()
                .filter(st -> st.getId().equals(subTaskId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("SubTask not found"));
        
        subTask.setStatus(status);
        if (remarks != null && !remarks.isEmpty()) {
            subTask.setRemarks(remarks);
        }
        subTask.setProgressPercentage(progressPercentage);
        subTask.setCompletedBy(updatedBy);
        
        if (status == SubTask.TaskStatus.COMPLETED) {
            subTask.setCompletedAt(java.time.LocalDateTime.now());
            subTask.setProgressPercentage(100);
        }
        
        task.calculateProgress();
        machine.calculateOverallProgress();
        machine.setLastUpdatedBy(updatedBy);
        
        return machineRepository.save(machine);
    }
    
    public List<Machine> getAllMachines() {
        return machineRepository.findByActiveTrue();
    }
    
    public List<Machine> getMachinesByStatus(Machine.MachineStatus status) {
        return machineRepository.findByActiveTrueAndStatus(status);
    }
    
    public List<Machine> getMachinesByManager(String managerId) {
        return machineRepository.findByActiveTrueAndAssignedManagerId(managerId);
    }
    
    public Machine getMachineById(String id) {
        return machineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Machine not found"));
    }
    
    public Machine getMachineByMachineId(String machineId) {
        return machineRepository.findByMachineId(machineId)
                .orElseThrow(() -> new RuntimeException("Machine not found"));
    }
    
    public Machine updateMachine(String machineId, Machine machineUpdate) {
        Machine machine = machineRepository.findByMachineId(machineId)
                .orElseThrow(() -> new RuntimeException("Machine not found"));
        
        if (machineUpdate.getMachineName() != null) {
            machine.setMachineName(machineUpdate.getMachineName());
        }
        if (machineUpdate.getMachineType() != null) {
            machine.setMachineType(machineUpdate.getMachineType());
        }
        if (machineUpdate.getDescription() != null) {
            machine.setDescription(machineUpdate.getDescription());
        }
        if (machineUpdate.getClientName() != null) {
            machine.setClientName(machineUpdate.getClientName());
        }
        if (machineUpdate.getClientContact() != null) {
            machine.setClientContact(machineUpdate.getClientContact());
        }
        if (machineUpdate.getProjectStartDate() != null) {
            machine.setProjectStartDate(machineUpdate.getProjectStartDate());
        }
        if (machineUpdate.getPoDate() != null) {
            machine.setPoDate(machineUpdate.getPoDate());
        }
        if (machineUpdate.getDeliveryPeriod() != null) {
            machine.setDeliveryPeriod(machineUpdate.getDeliveryPeriod());
        }
        if (machineUpdate.getAssignedManagerId() != null && 
            !machineUpdate.getAssignedManagerId().equals(machine.getAssignedManagerId())) {
            machine.setAssignedManagerId(machineUpdate.getAssignedManagerId());
            Optional<User> manager = userRepository.findById(machineUpdate.getAssignedManagerId());
            manager.ifPresent(user -> machine.setAssignedManager(user.getUsername()));
            
            // Send notification to new manager
            notificationService.sendMachineAddedNotification(machine, machineUpdate.getAssignedManagerId());
        }
        
        return machineRepository.save(machine);
    }
    
    public void deleteMachine(String machineId) {
        Machine machine = machineRepository.findByMachineId(machineId)
                .orElseThrow(() -> new RuntimeException("Machine not found"));
        machine.setActive(false);
        machineRepository.save(machine);
    }
    
    public Machine updateMachineStatus(String machineId, Machine.MachineStatus status) {
        Machine machine = machineRepository.findByMachineId(machineId)
                .orElseThrow(() -> new RuntimeException("Machine not found"));
        machine.setStatus(status);
        return machineRepository.save(machine);
    }
}
