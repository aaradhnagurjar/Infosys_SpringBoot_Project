package com.InsurAi.Controller;

import com.InsurAi.Dto.LoginRequest;
import com.InsurAi.Dto.SignupRequest;
import com.InsurAi.Dto.UserProfileResponse;
import com.InsurAi.Entity.User;
import com.InsurAi.Repository.UserRepository;
import com.InsurAi.Dto.UserProfileRequest;
import com.InsurAi.Service.EmailService;
import com.InsurAi.Service.UserService;
import com.InsurAi.Security.*;


import jakarta.servlet.http.HttpServletRequest;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;


@RestController
@RequestMapping("/auth")
public class AuthController {

    private final PasswordEncoder passwordEncoder;

    private final UserService userService;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final EmailService emailService;
    public AuthController(UserService userService, JwtService jwtService, UserRepository userRepository, PasswordEncoder passwordEncoder,EmailService emailService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder; // ✅ initialize it
        this.emailService = emailService;
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupRequest request) {
        userService.registerUser(request);
        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        if (!user.isVerified()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Please verify your email before logging in"));
        }

        // 🔐 Generate JWT
        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());

        // 🍪 Build Secure, HttpOnly Cookie
        ResponseCookie cookie = ResponseCookie.from("jwt", token)
                .httpOnly(true)                 // can't be accessed by JS — protects from XSS
                .secure(false)                  // set to true in prod (HTTPS only)
                .path("/")                      // accessible to whole site
                .maxAge(24 * 60 * 60)           // 1 day
                .sameSite("Strict")             // prevents CSRF (can use 'Lax' if needed)
                .build();

        // ✅ Return success + cookie header
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(Map.of("message", "Login successful","role",user.getRole()));
    }


    
    // ------------------- Get Profile -------------------
    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile(HttpServletRequest request) {
        String token = extractToken(request);
        String email = jwtService.extractUsername(token);

        UserProfileResponse response = userService.getProfile(email);
        return ResponseEntity.ok(response);
    }

    // ------------------- Update Profile -------------------
    @PutMapping("/profile")
    public ResponseEntity<String> updateProfile(@RequestBody UserProfileRequest profileRequest,
                                                HttpServletRequest request) {
        String token = extractToken(request);
        String email = jwtService.extractUsername(token);

        userService.updateProfile(email, profileRequest);
        return ResponseEntity.ok("Profile updated successfully");
    }

    // Helper: extract JWT from cookie
    private String extractToken(HttpServletRequest request) {
        if (request.getCookies() != null) {
            for (var cookie : request.getCookies()) {
                if ("jwt".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        throw new RuntimeException("JWT token not found in cookies");
    }
    
    @GetMapping("/verify")
    public ResponseEntity<String> verifyEmail(@RequestParam String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid verification token"));

        user.setVerified(true);
        user.setVerificationToken(null); // clear token after verification
        userRepository.save(user);

        return ResponseEntity.ok("Email verified successfully!");
    }

    // ------------------- reset password -------------------
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.OK)); 
                // ❌ Never reveal if email exists

        // Generate token
        String token = UUID.randomUUID().toString();
        user.setResetPasswordToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(30)); // 30 min expiry
        userRepository.save(user);

        // Send email
        emailService.sendSimpleEmail(
            user.getEmail(),
            "Reset Your Password",
            "Click this link to reset your password: " +
            "http://localhost:5173/reset-password?token=" + token
        );

        return ResponseEntity.ok(Map.of("message", "If this email exists, a reset link has been sent."));
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("password");

        User user = userRepository.findByResetPasswordToken(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid or expired token"));

        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token has expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetPasswordToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
    }


}
