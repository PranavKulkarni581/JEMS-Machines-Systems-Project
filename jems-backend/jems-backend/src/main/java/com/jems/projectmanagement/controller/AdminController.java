package com.jems.projectmanagement.controller;

import com.jems.projectmanagement.model.Machine;
import com.jems.projectmanagement.model.SubTask;
import com.jems.projectmanagement.model.Task;
import com.jems.projectmanagement.model.User;
import com.jems.projectmanagement.service.MachineService;
import com.jems.projectmanagement.service.NotificationService;
import com.jems.projectmanagement.service.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.jems.projectmanagement.model.Employee;
import com.jems.projectmanagement.repository.EmployeeRepository;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private MachineService machineService;
    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private NotificationService notificationService;
    
    // Manager Management
    @PostMapping("/managers")
    public ResponseEntity<?> createManager(@Valid @RequestBody ManagerRequest request, 
                                          Authentication authentication) {
        try {
            User manager = new User();
            manager.setUsername(request.getUsername());
            manager.setEmail(request.getEmail());
            manager.setPassword(request.getPassword());
            manager.setFullName(request.getFullName());
            manager.setPhoneNumber(request.getPhoneNumber());
            
            Set<User.Role> roles = new HashSet<>();
            roles.add(User.Role.MANAGER);
            manager.setRoles(roles);
            
            User createdManager = userService.createManager(manager, authentication.getName());
            
            return ResponseEntity.ok(createdManager);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/managers")
    public ResponseEntity<List<User>> getAllManagers() {
        return ResponseEntity.ok(userService.getAllManagers());
    }
    
    @GetMapping("/managers/{id}")
    public ResponseEntity<?> getManagerById(@PathVariable String id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/managers/{id}")
    public ResponseEntity<?> updateManager(@PathVariable String id, 
                                          @RequestBody User managerUpdate) {
        try {
            User updated = userService.updateUser(id, managerUpdate);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @DeleteMapping("/managers/{id}")
    public ResponseEntity<?> deleteManager(@PathVariable String id) {
        try {
            userService.deactivateUser(id);
            return ResponseEntity.ok(new MessageResponse("Manager deactivated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    // Machine Management
    @PostMapping("/machines")
    public ResponseEntity<?> createMachine(@Valid @RequestBody MachineRequest request,
                                          Authentication authentication) {
        try {
            Machine machine = new Machine();
            machine.setMachineId(request.getMachineId());
            machine.setMachineName(request.getMachineName());
            machine.setMachineType(request.getMachineType());
            machine.setDescription(request.getDescription());
            machine.setClientName(request.getClientName());
            machine.setClientContact(request.getClientContact());
            machine.setProjectStartDate(request.getProjectStartDate());
            machine.setPoDate(request.getPoDate());
            machine.setDeliveryPeriod(request.getDeliveryPeriod());
            machine.setAssignedManagerId(request.getAssignedManagerId());
            
            Machine createdMachine = machineService.createMachine(machine, authentication.getName());
            
            return ResponseEntity.ok(createdMachine);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/machines")
    public ResponseEntity<List<Machine>> getAllMachines() {
        return ResponseEntity.ok(machineService.getAllMachines());
    }
    
    @GetMapping("/machines/{machineId}")
    public ResponseEntity<?> getMachineByMachineId(@PathVariable String machineId) {
        try {
            Machine machine = machineService.getMachineByMachineId(machineId);
            return ResponseEntity.ok(machine);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/machines/{machineId}")
    public ResponseEntity<?> updateMachine(@PathVariable String machineId,
                                          @RequestBody MachineRequest request) {
        try {
            Machine machineUpdate = new Machine();
            machineUpdate.setMachineName(request.getMachineName());
            machineUpdate.setMachineType(request.getMachineType());
            machineUpdate.setDescription(request.getDescription());
            machineUpdate.setClientName(request.getClientName());
            machineUpdate.setClientContact(request.getClientContact());
            machineUpdate.setProjectStartDate(request.getProjectStartDate());
            machineUpdate.setPoDate(request.getPoDate());
            machineUpdate.setDeliveryPeriod(request.getDeliveryPeriod());
            machineUpdate.setAssignedManagerId(request.getAssignedManagerId());
            
            Machine updated = machineService.updateMachine(machineId, machineUpdate);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @DeleteMapping("/machines/{machineId}")
    public ResponseEntity<?> deleteMachine(@PathVariable String machineId) {
        try {
            machineService.deleteMachine(machineId);
            return ResponseEntity.ok(new MessageResponse("Machine deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    // Task Management
    @PostMapping("/machines/{machineId}/tasks")
    public ResponseEntity<?> addTask(@PathVariable String machineId,
                                     @Valid @RequestBody TaskRequest request) {
        try {
            Task task = new Task();
            task.setStageName(request.getStageName());
            task.setStageNumber(request.getStageNumber());
            task.setDescription(request.getDescription());
            task.setCheckedBy(request.getCheckedBy());
            task.setApprovedBy(request.getApprovedBy());
            task.setAssignedTo(request.getAssignedTo());
            task.setStartDate(request.getStartDate());
            task.setEndDate(request.getEndDate());
            
            Machine updated = machineService.addTaskToMachine(machineId, task);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    // SubTask Management
    @PostMapping("/machines/{machineId}/tasks/{taskId}/subtasks")
    public ResponseEntity<?> addSubTask(@PathVariable String machineId,
                                       @PathVariable String taskId,
                                       @Valid @RequestBody SubTaskRequest request) {
        try {
            SubTask subTask = new SubTask();
            subTask.setName(request.getName());
            subTask.setDescription(request.getDescription());
            subTask.setAssignedEmployee(request.getAssignedEmployee());
            subTask.setAssignedEmployeeId(request.getAssignedEmployeeId());
            subTask.setStartDate(request.getStartDate());
            subTask.setEndDate(request.getEndDate());
            
            Machine updated = machineService.addSubTaskToTask(machineId, taskId, subTask);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    // Progress Overview
    @GetMapping("/progress")
    public ResponseEntity<?> getAllProgress() {
        List<Machine> machines = machineService.getAllMachines();
        return ResponseEntity.ok(machines);
    }
    
    @GetMapping("/progress/{machineId}")
    public ResponseEntity<?> getMachineProgress(@PathVariable String machineId) {
        try {
            Machine machine = machineService.getMachineByMachineId(machineId);
            return ResponseEntity.ok(machine);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/employees")
    public ResponseEntity<Employee> createEmployee(
            @RequestBody EmployeeRequest request) {

        Employee employee = new Employee();
        employee.setName(request.getName());

        Employee savedEmployee = employeeRepository.save(employee);
        return ResponseEntity.ok(savedEmployee);
    }

    @GetMapping("/employees")
    public ResponseEntity<List<Employee>> getAllEmployees() {
        return ResponseEntity.ok(employeeRepository.findAll());
    }


    // Inner classes for requests
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    static class ManagerRequest {
        private String username;
        private String email;
        private String password;
        private String fullName;
        private String phoneNumber;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    static class MachineRequest {
        private String machineId;
        private String machineName;
        private String machineType;
        private String description;
        private String clientName;
        private String clientContact;
        private java.time.LocalDateTime projectStartDate;
        private java.time.LocalDateTime poDate;
        private java.time.LocalDateTime deliveryPeriod;
        private String assignedManagerId;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    static class TaskRequest {
        private String stageName;
        private String stageNumber;
        private String description;
        private String checkedBy;
        private String approvedBy;
        private String assignedTo;
        private java.time.LocalDateTime startDate;
        private java.time.LocalDateTime endDate;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    static class SubTaskRequest {
        private String name;
        private String description;
        private String assignedEmployee;
        private String assignedEmployeeId;
        private java.time.LocalDateTime startDate;
        private java.time.LocalDateTime endDate;
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
    static class EmployeeRequest {
        private String name;
    }

}
