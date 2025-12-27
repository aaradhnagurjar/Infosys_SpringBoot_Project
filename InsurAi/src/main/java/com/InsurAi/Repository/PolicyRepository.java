package com.InsurAi.Repository;



import com.InsurAi.Entity.Policy;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PolicyRepository extends JpaRepository<Policy, Long> {
    // Optional: add custom queries later if needed
    Optional<Policy> findByName(String name);
}
