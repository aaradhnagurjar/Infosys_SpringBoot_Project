package com.InsurAi.Repository;

import com.InsurAi.Entity.Availability;
import com.InsurAi.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AvailabilityRepository extends JpaRepository<Availability, Long> {

    // Get all slots for an agent
    List<Availability> findByAgent(User agent);

    // Get all available slots for a given date
    List<Availability> findByDateAndIsBookedFalse(LocalDate date);

    // Get available slots for a specific agent and date
    List<Availability> findByAgentAndDateAndIsBookedFalse(User agent, LocalDate date);
    void deleteByAgentId(Long agentId);
    
    List<Availability> findByAgentIdAndDateAndIsBookedFalse(Long agentId, LocalDate date);
    List<Availability> findByDate(LocalDate date);
}
