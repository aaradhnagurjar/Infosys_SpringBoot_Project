package com.InsurAi.Service;


import com.InsurAi.Entity.*;
import com.InsurAi.Entity.Appointment.AppointmentStatus;
import com.InsurAi.Repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final AvailabilityRepository availabilityRepository;
    private UserPolicyRepository userPolicyRepository;
    private final EmailService emailService;

    public AppointmentService(AppointmentRepository appointmentRepository, AvailabilityRepository availabilityRepository,UserPolicyRepository userPolicyRepository,EmailService emailService) {
        this.appointmentRepository = appointmentRepository;
        this.availabilityRepository = availabilityRepository;
        this.userPolicyRepository =  userPolicyRepository;
        this.emailService = emailService;
    }

    // ✅ User books an appointment with an agent
    @Transactional
    public Appointment bookAppointment(User user, User agent, LocalDate date, LocalTime time,String policyName) {
        // 1️⃣ Check availability
        List<Availability> availableSlots = availabilityRepository.findByAgentAndDateAndIsBookedFalse(agent, date);

        Availability matchingSlot = availableSlots.stream()
                .filter(slot -> !time.isBefore(slot.getStartTime()) && !time.isAfter(slot.getEndTime()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No available slot for the selected time."));

        // 2️⃣ Create appointment
        Appointment appointment = Appointment.builder()
                .agent(agent)
                .user(user)
                .date(date)
                .time(time)
                .policyName(policyName)
                .status(AppointmentStatus.SCHEDULED)
                .build();
        appointmentRepository.save(appointment);
        
        System.out.println(agent);

        // 3️⃣ Mark slot as booked
        matchingSlot.setBooked(true);
        availabilityRepository.save(matchingSlot);
        sendBookingEmails(user, agent, date,time);

        return appointment;
    }
    
    public void sendBookingEmails(User user, User agent, LocalDate date, LocalTime time) {
        String userMsg = String.format(
            "Hi %s,\n\nYour booking with agent %s has been scheduled for %s at %s.\n\nRegards,\nInsurAI Team",
            user.getName(), agent.getName(), date, time
        );

        emailService.sendBookingEmail(
            user.getEmail(),
            "Booking Confirmation - InsurAI",
            userMsg,
            agent.getEmail(),
            date,
            time
        );

        String agentMsg = String.format(
            "Hello %s,\n\nYou have a new booking from %s scheduled for %s at %s.\n\n- InsurAI Team",
            agent.getName(), user.getName(), date, time
        );

        emailService.sendBookingEmail(
            agent.getEmail(),
            "New Booking Assigned - InsurAI",
            agentMsg,
            user.getEmail(),
            date,
            time
        );
    }




    // ✅ Get all appointments of a user
    public List<Appointment> getUserAppointments(User user) {
        return appointmentRepository.findByUser(user);
    }
    
    @Transactional
    public UserPolicy completeAppointmentAndCreatePolicy(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (appointment.getStatus() != AppointmentStatus.SCHEDULED)
            throw new RuntimeException("Appointment already processed.");

        appointment.setStatus(AppointmentStatus.COMPLETED);
        appointmentRepository.save(appointment);

        UserPolicy userPolicy = UserPolicy.builder()
                .policyName(appointment.getPolicyName())
                .user(appointment.getUser())
                .agent(appointment.getAgent())
                .policyStartDate(LocalDate.now())
                .policyEndDate(LocalDate.now().plusYears(1))
                .status(UserPolicy.PolicyStatus.PENDING_DETAILS)
                .build();

        return userPolicyRepository.save(userPolicy);
    }


}
