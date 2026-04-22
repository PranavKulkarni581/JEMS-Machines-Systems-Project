package com.jems.projectmanagement.dto;

import com.jems.projectmanagement.model.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

// Login Request
@Data
@NoArgsConstructor
@AllArgsConstructor
class LoginRequest {
    @NotBlank
    private String username;
    
    @NotBlank
    private String password;
}

// Register Request
@Data
@NoArgsConstructor
@AllArgsConstructor
class RegisterRequest {
    @NotBlank
    @Size(min = 3, max = 20)
    private String username;
    
    @NotBlank
    @Email
    private String email;
    
    @NotBlank
    @Size(min = 6, max = 40)
    private String password;
    
    @NotBlank
    private String fullName;
    
    private String phoneNumber;
    
    private Set<User.Role> roles;
}

// JWT Response
@Data
@NoArgsConstructor
@AllArgsConstructor
class JwtResponse {
    private String token;
    private String type = "Bearer";
    private String id;
    private String username;
    private String email;
    private String fullName;
    private Set<User.Role> roles;
    
    public JwtResponse(String token, String id, String username, String email, String fullName, Set<User.Role> roles) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.roles = roles;
    }
}

// Message Response
@Data
@NoArgsConstructor
@AllArgsConstructor
class MessageResponse {
    private String message;
}
