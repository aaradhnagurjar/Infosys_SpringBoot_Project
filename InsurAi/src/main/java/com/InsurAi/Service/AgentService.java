package com.InsurAi.Service;


import com.InsurAi.Entity.*;
import com.InsurAi.Repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AgentService {

    private final AvailabilityRepository availabilityRepository;
    private final AppointmentRepository appointmentRepository;

    public AgentService(AvailabilityRepository availabilityRepository, AppointmentRepository appointmentRepository) {
        this.availabilityRepository = availabilityRepository;
        this.appointmentRepository = appointmentRepository;
    }

    // ✅ Add a new availability slot for an agent
    public Availability addAvailability(User agent, LocalDate date, String startTime, String endTime) {
        Availability availability = Availability.builder()
                .agent(agent)
                .date(date)
                .startTime(java.time.LocalTime.parse(startTime))
                .endTime(java.time.LocalTime.parse(endTime))
                .isBooked(false)
                .build();
        return availabilityRepository.save(availability);
    }

    // ✅ Get all availability slots for this agent
    public List<Availability> getAgentAvailability(User agent) {
        return availabilityRepository.findByAgent(agent);
    }
    
    public List<User> getAvailableAgentsForDate(LocalDate date) {
        // Fetch all availabilities for the given date
        List<Availability> availabilities = availabilityRepository.findByDate(date);

        // Map to list of agents
        return availabilities.stream()
                .map(Availability::getAgent)
                .distinct()
                .toList();
    }

    // ✅ Get upcoming appointments for an agent
    public List<Appointment> getUpcomingAppointments(User agent) {
        return appointmentRepository.findByAgentAndDateGreaterThanEqualAndStatus(
                agent, LocalDate.now(), Appointment.AppointmentStatus.SCHEDULED
        );
    }
    
 // ✅ Get all unbooked availability slots for a specific agent and date
    public List<Availability> getAvailabilityForAgentAndDate(Long agentId, LocalDate date) {
        return availabilityRepository.findByAgentIdAndDateAndIsBookedFalse(agentId, date);
    }

}
