package com.jems.projectmanagement.config;

import com.jems.projectmanagement.model.Machine;
import com.jems.projectmanagement.model.SubTask;
import com.jems.projectmanagement.model.Task;
import com.jems.projectmanagement.model.User;
import com.jems.projectmanagement.repository.MachineRepository;
import com.jems.projectmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

// @Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private MachineRepository machineRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        
        // Check if data already exists
        if (userRepository.count() > 0) {
            System.out.println("Data already initialized. Skipping...");
            return;
        }
        
        System.out.println("Initializing sample data...");
        
        // Create Admin User
        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail("admin@jems.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setFullName("Admin User");
        admin.setPhoneNumber("+91-1234567890");
        Set<User.Role> adminRoles = new HashSet<>();
        adminRoles.add(User.Role.ADMIN);
        admin.setRoles(adminRoles);
        admin.setActive(true);
        admin = userRepository.save(admin);
        System.out.println("✓ Created admin user: " + admin.getUsername());
        
        // Create Manager Users
        List<User> managers = new ArrayList<>();
        for (int i = 1; i <= 3; i++) {
            User manager = new User();
            manager.setUsername("manager" + i);
            manager.setEmail("manager" + i + "@jems.com");
            manager.setPassword(passwordEncoder.encode("manager123"));
            manager.setFullName("Manager " + i);
            manager.setPhoneNumber("+91-987654321" + i);
            Set<User.Role> managerRoles = new HashSet<>();
            managerRoles.add(User.Role.MANAGER);
            manager.setRoles(managerRoles);
            manager.setActive(true);
            manager.setCreatedBy(admin.getUsername());
            manager = userRepository.save(manager);
            managers.add(manager);
            System.out.println("✓ Created manager: " + manager.getUsername());
        }
        
        // Create Sample Machines
        List<String> machineTypes = List.of(
                "CNC Milling Machine",
                "Lathe Machine",
                "Drilling Machine"
        );
        List<String> clients = List.of(
                "ABC Industries",
                "XYZ Manufacturing",
                "PQR Engineering"
        );
        for (int i = 0; i < 3; i++) {
            Machine machine = new Machine();
            machine.setMachineId("M-2024-00" + (i + 1));
            machine.setMachineName(machineTypes.get(i));
            machine.setClientName(clients.get(i));

            machine.setDescription("High precision " + machineTypes.get(i).toLowerCase() + " for industrial use");
            machine.setClientName(clients.get(i));
            machine.setClientContact("+91-111222333" + i);
            machine.setProjectStartDate(LocalDateTime.now().minusDays(30));
            machine.setPoDate(LocalDateTime.now().minusDays(35));
            machine.setDeliveryPeriod(LocalDateTime.now().plusDays(150));
            machine.setStatus(Machine.MachineStatus.IN_PROGRESS);
            machine.setAssignedManagerId(managers.get(i).getId());
            machine.setAssignedManager(managers.get(i).getUsername());
            machine.setCreatedBy(admin.getUsername());
            machine.setActive(true);
            
            // Add Tasks
            List<Task> tasks = createSampleTasks();
            machine.setTasks(tasks);
            
            // Calculate progress
            machine.calculateOverallProgress();
            
            machine = machineRepository.save(machine);
            System.out.println("✓ Created machine: " + machine.getMachineId() + " - " + machine.getMachineName());
        }
        
        System.out.println(" ========================================");
        System.out.println("Sample data initialization completed!");
        System.out.println("========================================");
        System.out.println("Login Credentials:");
        System.out.println("Admin - username: admin, password: admin123");
        System.out.println("Manager1 - username: manager1, password: manager123");
        System.out.println("Manager2 - username: manager2, password: manager123");
        System.out.println("Manager3 - username: manager3, password: manager123");
        System.out.println("======================================== ");
    }
    
    private List<Task> createSampleTasks() {
        List<Task> tasks = new ArrayList<>();
        
        // Task 1: Design
        Task designTask = new Task();
        designTask.setId(java.util.UUID.randomUUID().toString());
        designTask.setStageName("Design");
        designTask.setStageNumber("1");
        designTask.setDescription("Complete design phase with all specifications");
        designTask.setCheckedBy("SD");
        designTask.setApprovedBy("JJK");
        designTask.setAssignedTo("Chief Designer");
        designTask.setStartDate(LocalDateTime.now().minusDays(30));
        designTask.setEndDate(LocalDateTime.now().minusDays(15));
        designTask.setStatus(Task.TaskStatus.COMPLETED);
        
        // Add subtasks to design
        List<SubTask> designSubTasks = new ArrayList<>();
        designSubTasks.add(createSubTask("Fabrication", "EMP001", SubTask.TaskStatus.COMPLETED, 100));
        designSubTasks.add(createSubTask("Machining", "EMP002", SubTask.TaskStatus.COMPLETED, 100));
        designTask.setSubTasks(designSubTasks);
        designTask.calculateProgress();
        tasks.add(designTask);
        
        // Task 2: DAP (Design Approval Process)
        Task dapTask = new Task();
        dapTask.setId(java.util.UUID.randomUUID().toString());
        dapTask.setStageName("DAP");
        dapTask.setStageNumber("2");
        dapTask.setDescription("Design approval and verification");
        dapTask.setCheckedBy("SD");
        dapTask.setApprovedBy("JJK");
        dapTask.setStartDate(LocalDateTime.now().minusDays(15));
        dapTask.setEndDate(LocalDateTime.now().minusDays(10));
        dapTask.setStatus(Task.TaskStatus.COMPLETED);
        dapTask.setProgressPercentage(100);
        tasks.add(dapTask);
        
        // Task 3: Fabrication
        Task fabricationTask = new Task();
        fabricationTask.setId(java.util.UUID.randomUUID().toString());
        fabricationTask.setStageName("Fabrication");
        fabricationTask.setStageNumber("3");
        fabricationTask.setDescription("Fabricate machine components");
        fabricationTask.setStartDate(LocalDateTime.now().minusDays(10));
        fabricationTask.setEndDate(LocalDateTime.now().plusDays(20));
        fabricationTask.setStatus(Task.TaskStatus.IN_PROGRESS);
        
        List<SubTask> fabricationSubTasks = new ArrayList<>();
        fabricationSubTasks.add(createSubTask("Painting Job", "EMP003", SubTask.TaskStatus.COMPLETED, 100));
        fabricationSubTasks.add(createSubTask("Welding", "EMP004", SubTask.TaskStatus.IN_PROGRESS, 60));
        fabricationSubTasks.add(createSubTask("Assembly", "EMP005", SubTask.TaskStatus.PENDING, 0));
        fabricationTask.setSubTasks(fabricationSubTasks);
        fabricationTask.calculateProgress();
        tasks.add(fabricationTask);
        
        // Task 4: Purchase Process
        Task purchaseTask = new Task();
        purchaseTask.setId(java.util.UUID.randomUUID().toString());
        purchaseTask.setStageName("Purchase Process");
        purchaseTask.setStageNumber("4");
        purchaseTask.setDescription("Purchase required components");
        purchaseTask.setStartDate(LocalDateTime.now());
        purchaseTask.setEndDate(LocalDateTime.now().plusDays(15));
        purchaseTask.setStatus(Task.TaskStatus.IN_PROGRESS);
        
        List<SubTask> purchaseSubTasks = new ArrayList<>();
        purchaseSubTasks.add(createSubTask("Machining Parts", "EMP006", SubTask.TaskStatus.IN_PROGRESS, 40));
        purchaseSubTasks.add(createSubTask("Plating & Coating", "EMP007", SubTask.TaskStatus.PENDING, 0));
        purchaseTask.setSubTasks(purchaseSubTasks);
        purchaseTask.calculateProgress();
        tasks.add(purchaseTask);
        
        // Task 5: Trials
        Task trialsTask = new Task();
        trialsTask.setId(java.util.UUID.randomUUID().toString());
        trialsTask.setStageName("Trials");
        trialsTask.setStageNumber("5");
        trialsTask.setDescription("Testing and trials");
        trialsTask.setStartDate(LocalDateTime.now().plusDays(20));
        trialsTask.setEndDate(LocalDateTime.now().plusDays(30));
        trialsTask.setStatus(Task.TaskStatus.PENDING);
        trialsTask.setProgressPercentage(0);
        tasks.add(trialsTask);
        
        return tasks;
    }
    
    private SubTask createSubTask(String name, String empId, SubTask.TaskStatus status, int progress) {
        SubTask subTask = new SubTask();
        subTask.setId(java.util.UUID.randomUUID().toString());
        subTask.setName(name);
        subTask.setDescription(name + " work");
        subTask.setAssignedEmployee("Employee " + empId);
        subTask.setAssignedEmployeeId(empId);
        subTask.setStatus(status);
        subTask.setProgressPercentage(progress);
        subTask.setStartDate(LocalDateTime.now().minusDays(10));
        subTask.setEndDate(LocalDateTime.now().plusDays(10));
        
        if (status == SubTask.TaskStatus.COMPLETED) {
            subTask.setCompletedAt(LocalDateTime.now().minusDays(2));
            subTask.setCompletedBy("manager1");
            subTask.setRemarks("Completed successfully");
        } else if (status == SubTask.TaskStatus.IN_PROGRESS) {
            subTask.setRemarks("Work in progress");
        }
        
        return subTask;
    }
}
