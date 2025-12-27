package com.InsurAi.Repository;

import com.InsurAi.Entity.UserPolicy;
import com.InsurAi.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserPolicyRepository extends JpaRepository<UserPolicy, Long> {
    List<UserPolicy> findByUser(User user);
    List<UserPolicy> findByAgent(User agent);
    List<UserPolicy> findByUserId(Long userId);
}
