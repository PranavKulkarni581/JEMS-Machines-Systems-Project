package com.jems.projectmanagement.repository;

import com.jems.projectmanagement.model.Employee;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends MongoRepository<Employee, String> {
    // no extra methods needed for now
}
