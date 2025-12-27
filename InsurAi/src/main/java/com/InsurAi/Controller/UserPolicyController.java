package com.InsurAi.Controller;

import com.InsurAi.Dto.UserPolicyUpdateRequest;
import com.InsurAi.Entity.UserPolicy;
import com.InsurAi.Security.JwtService;
import com.InsurAi.Service.UserPolicyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class UserPolicyController {

    private final JwtService jwtService;
    private final UserPolicyService userPolicyService;

    @GetMapping("/policies")
    public ResponseEntity<List<UserPolicy>> getUserPolicies(HttpServletRequest request) {
        String token = extractToken(request);

        String email = jwtService.extractUsername(token);

        List<UserPolicy> policies = userPolicyService.getPoliciesByUserEmail(email);
        return ResponseEntity.ok(policies);
    }

    // ✅ same helper pattern as your profile controller
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
    
    @PutMapping("/{id}")
    public ResponseEntity<UserPolicy> updatePolicyDetails(
            @PathVariable Long id,
            @RequestBody UserPolicyUpdateRequest request,
            HttpServletRequest servletRequest) {

        String token = extractToken(servletRequest);
        String email = jwtService.extractUsername(token);

        UserPolicy updated = userPolicyService.updatePolicyDetails(id, request, email);
        return ResponseEntity.ok(updated);
    }
}
