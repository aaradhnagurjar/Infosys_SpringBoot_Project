package com.InsurAi.Controller;

import java.time.LocalDate;
import java.util.List;
import com.InsurAi.Service.PolicyService;
import com.InsurAi.Service.AgentService;
import com.InsurAi.Service.AppointmentService;


import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.InsurAi.Entity.Appointment;
import com.InsurAi.Entity.Availability;
import com.InsurAi.Entity.Policy;
import com.InsurAi.Entity.User;
import com.InsurAi.Repository.UserRepository;
import com.InsurAi.Security.JwtService;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class PublicController {

    private final PolicyService policyService;
    private final AgentService agentService;
    private final UserRepository userRepository;
    private final JwtService jwtService; // helper to parse JWT
    private final AppointmentService appointmentService;

    PublicController(PolicyService policyService,AgentService agentService, UserRepository userRepository, JwtService jwtService,AppointmentService appointmentService) {
        this.policyService = policyService;
        this.agentService = agentService;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.appointmentService = appointmentService;
    }
    
    @GetMapping("/public/policies")
    public List<Policy> getAllPolicies() {
    	return policyService.getAllPolicies();
    }
    

    
    @GetMapping("/public/agent")
    public List<User> getAvailableAgents() {
        LocalDate today = LocalDate.now(); // current date
        return agentService.getAvailableAgentsForDate(today);
    }
    
    @GetMapping("/public/agent/{agentId}/availability")
    public List<Availability> getAgentAvailabilityForToday(@PathVariable Long agentId) {
        LocalDate today = LocalDate.now();
        return agentService.getAvailabilityForAgentAndDate(agentId, today);
    }



    
//    @GetMapping("/public/{userId}")
//    public List<Appointment> getUserAppointments(@PathVariable Long userId) {
//        User user = new User();
//        user.setId(userId);
//        return appointmentService.getUserAppointments(user);
//    }
    @GetMapping("/public/{email}")
    public List<Appointment> getUserAppointmentsByEmail(@PathVariable String email) {
        // Fetch user by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found with email: " + email));

        // Fetch appointments for this user
        return appointmentService.getUserAppointments(user);
    }

    
}
