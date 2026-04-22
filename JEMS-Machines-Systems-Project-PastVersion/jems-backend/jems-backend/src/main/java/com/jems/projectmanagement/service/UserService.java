package com.jems.projectmanagement.service;

import com.jems.projectmanagement.model.User;
import com.jems.projectmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public User createUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }
    
    public User createManager(User manager, String adminUsername) {
        manager.setCreatedBy(adminUsername);
        if (!manager.getRoles().contains(User.Role.MANAGER)) {
            manager.getRoles().add(User.Role.MANAGER);
        }
        return createUser(manager);
    }
    
    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }
    
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    public List<User> getAllManagers() {
        return userRepository.findByRolesContaining(User.Role.MANAGER);
    }
    
    public List<User> getAllActiveUsers() {
        return userRepository.findByActiveTrue();
    }
    
    public List<User> getManagersCreatedByAdmin(String adminUsername) {
        return userRepository.findByCreatedBy(adminUsername);
    }
    
    public User updateUser(String id, User userUpdate) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (userUpdate.getFullName() != null) {
            user.setFullName(userUpdate.getFullName());
        }
        if (userUpdate.getEmail() != null && !userUpdate.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(userUpdate.getEmail())) {
                throw new RuntimeException("Email already exists");
            }
            user.setEmail(userUpdate.getEmail());
        }
        if (userUpdate.getPhoneNumber() != null) {
            user.setPhoneNumber(userUpdate.getPhoneNumber());
        }
        
        return userRepository.save(user);
    }
    
    public void deactivateUser(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(false);
        userRepository.save(user);
    }
    
    public void activateUser(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(true);
        userRepository.save(user);
    }
    
    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }
}
