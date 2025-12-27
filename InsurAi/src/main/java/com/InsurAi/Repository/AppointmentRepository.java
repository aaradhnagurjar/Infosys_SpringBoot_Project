package com.InsurAi.Repository;


import com.InsurAi.Entity.Appointment;
import com.InsurAi.Entity.Appointment.AppointmentStatus;
import com.InsurAi.Entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // Get all appointments for a specific agent
    List<Appointment> findByAgent(User agent);

    // Get all appointments for a user (client)
    List<Appointment> findByUser(User user);

    // Get upcoming appointments for agent (scheduled and after today)
    List<Appointment> findByAgentAndDateGreaterThanEqualAndStatus(
            User agent, LocalDate date, AppointmentStatus status
    );
    void deleteByUserId(Long userId);
}
