package com.InsurAi.Service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

import org.springframework.http.HttpStatus;


import com.InsurAi.Dto.*;
import com.InsurAi.Entity.User;
import com.InsurAi.Repository.UserRepository;
import com.InsurAi.Security.JwtService;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;
    
    public UserService(UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            EmailService emailService) {
this.userRepository = userRepository;
this.passwordEncoder = passwordEncoder;
this.jwtService = jwtService;
this.emailService = emailService;
}

    public void registerUser(SignupRequest request) {
        String token = UUID.randomUUID().toString(); // generate token

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .verificationToken(token) // save token
                .isVerified(false)        // mark unverified
                .build();

        userRepository.save(user);

        // send verification email
        emailService.sendSimpleEmail(
            user.getEmail(),
            "Verify your email",
            "Click the link to verify your account: " +
            "http://localhost:8080/auth/verify?token=" + token
        );
    }


    public String loginUser(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> 
                    new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password")
                );

        // ✅ Always check password first
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        // ✅ Now check if email is verified
        if (!user.isVerified()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Please verify your email before logging in");
        }

        // ✅ Generate JWT token
        return jwtService.generateToken(user.getEmail(), user.getRole().name());
    }


    
    // ------------------- Profile -------------------
    
    public UserProfileResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return UserProfileResponse.builder()
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getNumber())
                .address(user.getAddress())
                .dateOfBirth(user.getDateOfBirth())
                .role(user.getRole().name())
                .build();
    }
    
    public void updateProfile(String email, UserProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getName() != null) user.setName(request.getName());
        if (request.getPhone() != null) user.setNumber(request.getPhone());
        if (request.getAddress() != null) user.setAddress(request.getAddress());
        if (request.getDateOfBirth() != null) user.setDateOfBirth(request.getDateOfBirth());

        userRepository.save(user);
    }

    
}
