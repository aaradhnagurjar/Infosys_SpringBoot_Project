package com.InsurAi.Service;

import com.InsurAi.Dto.UserPolicyUpdateRequest;
import com.InsurAi.Entity.User;
import com.InsurAi.Entity.UserPolicy;
import com.InsurAi.Entity.UserPolicy.PolicyStatus;
import com.InsurAi.Repository.UserPolicyRepository;
import com.InsurAi.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserPolicyService {

    private final UserRepository userRepository;
    private final UserPolicyRepository userPolicyRepository;

    public List<UserPolicy> getPoliciesByUserEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return userPolicyRepository.findByUser(user);
    }
    public UserPolicy updatePolicyDetails(Long id, UserPolicyUpdateRequest request, String email) {
        UserPolicy policy = userPolicyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Policy not found"));

        // Ensure the logged-in user owns this policy
        if (!policy.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized to update this policy");
        }

        // Update only allowed fields
        policy.setAddress(request.getAddress());
        policy.setAnnualIncome(request.getAnnualIncome());
        policy.setNationalId(request.getNationalId());
        policy.setNomineeName(request.getNomineeName());
        policy.setStatus(PolicyStatus.ACTIVE);

        return userPolicyRepository.save(policy);
    }
    
    public List<UserPolicy> getAllUserPolicies() {
        return userPolicyRepository.findAll();
    }
}
