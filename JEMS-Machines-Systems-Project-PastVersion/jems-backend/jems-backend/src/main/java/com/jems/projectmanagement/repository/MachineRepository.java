package com.jems.projectmanagement.repository;

import com.jems.projectmanagement.model.Machine;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MachineRepository extends MongoRepository<Machine, String> {
    
    Optional<Machine> findByMachineId(String machineId);
    
    boolean existsByMachineId(String machineId);
    
    List<Machine> findByActiveTrue();
    
    List<Machine> findByStatus(Machine.MachineStatus status);
    
    List<Machine> findByAssignedManagerId(String managerId);
    
    List<Machine> findByCreatedBy(String createdBy);
    
    List<Machine> findByActiveTrueAndStatus(Machine.MachineStatus status);
    
    List<Machine> findByActiveTrueAndAssignedManagerId(String managerId);
}
