//package com.jems.projectmanagement.repository;
//
//import com.jems.projectmanagement.model.TaskFile;
//import org.springframework.data.mongodb.repository.MongoRepository;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//
//@Repository
//public interface TaskFileRepository extends MongoRepository<TaskFile, String> {
//
//    // Get files by machine
//    List<TaskFile> findByMachineId(String machineId);
//
//    // Get files by machine + task
//    List<TaskFile> findByMachineIdAndTaskId(String machineId, String taskId);
//}
