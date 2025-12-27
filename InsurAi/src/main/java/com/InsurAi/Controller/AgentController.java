package com.InsurAi.Controller;

import com.InsurAi.Entity.*;
import com.InsurAi.Repository.UserRepository;
import com.InsurAi.Service.AgentService;
import com.InsurAi.Service.AppointmentService;
import com.InsurAi.Security.JwtService; // your JWT util/service

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/agent")
public class AgentController {

    private final AgentService agentService;
    private final UserRepository userRepository;
    private final JwtService jwtService; // helper to parse 
    private AppointmentService appointmentService;

    public AgentController(AgentService agentService, UserRepository userRepository, JwtService jwtService,AppointmentService appointmentService) {
        this.agentService = agentService;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.appointmentService = appointmentService;
    }

    // Helper method to get logged-in agent from JWT in cookies
    private User getLoggedInAgent(HttpServletRequest request) {
        // Extract JWT from cookies
        String jwt = null;
        if (request.getCookies() != null) {
            for (var cookie : request.getCookies()) {
                if ("jwt".equals(cookie.getName())) {
                    jwt = cookie.getValue();
                    break;
                }
            }
        }

        if (jwt == null) throw new RuntimeException("JWT not found in cookies");

        // Extract email from JWT
        String email = jwtService.extractUsername(jwt);

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Agent not found"));
    }

    @PostMapping("/availability")
    public Availability addAvailability(
            HttpServletRequest request,
            @RequestParam String date,
            @RequestParam String startTime,
            @RequestParam String endTime
    ) {
        User agent = getLoggedInAgent(request);
        return agentService.addAvailability(agent, LocalDate.parse(date), startTime, endTime);
    }

    @GetMapping("/availability")
    public List<Availability> getAvailability(HttpServletRequest request) {
        User agent = getLoggedInAgent(request);
        return agentService.getAgentAvailability(agent);
    }

    @GetMapping("/appointments")
    public List<Appointment> getUpcomingAppointments(HttpServletRequest request) {
        User agent = getLoggedInAgent(request);
        return agentService.getUpcomingAppointments(agent);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<UserPolicy> markAppointmentCompleted(@PathVariable Long id) {
        UserPolicy policy = appointmentService.completeAppointmentAndCreatePolicy(id);
        return ResponseEntity.ok(policy);
    }


}
