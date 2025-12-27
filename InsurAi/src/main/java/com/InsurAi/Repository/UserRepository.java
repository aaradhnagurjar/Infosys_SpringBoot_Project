package com.InsurAi.Repository;


import com.InsurAi.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // find user by email (used in login)
    Optional<User> findByEmail(String email);
    Optional<User> findByName(String name);
    List<User> findByRoleAndNameContainingIgnoreCase(User.Role role, String name);


    // check if user exists (useful in signup validation)
    boolean existsByEmail(String email);
    Optional<User> findByVerificationToken(String token);
    Optional<User> findByResetPasswordToken(String token);
}
