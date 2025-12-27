package com.InsurAi.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @JsonIgnore
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    // ✅ Optional fields
    @Column(nullable = true)
    private String number; // phone number or contact number

    @Column(nullable = true, length = 255)
    private String address;

    @Column(nullable = true)
    private LocalDate dateOfBirth;

    public enum Role {
        USER,
        AGENT,
        ADMIN
    }
    
    // Email verification
    @Column(name = "is_verified")
    private boolean isVerified = false;

    private String verificationToken; // store UUID token
    
    // reset password
    private String resetPasswordToken;  // store UUID token
    private LocalDateTime resetTokenExpiry; // token expiry time

}
