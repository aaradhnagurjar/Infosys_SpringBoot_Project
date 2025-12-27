package com.InsurAi.Service;

import com.InsurAi.Entity.Policy;
import com.InsurAi.Repository.PolicyRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PolicyService {

    private final PolicyRepository policyRepository;

    public PolicyService(PolicyRepository policyRepository) {
        this.policyRepository = policyRepository;
    }

    // Create
    public Policy createPolicy(Policy policy) {
        policy.setCreatedAt(LocalDateTime.now());
        policy.setUpdatedAt(LocalDateTime.now());
        return policyRepository.save(policy);
    }

    // Read all
    public List<Policy> getAllPolicies() {
        return policyRepository.findAll();
    }

    // Read by id
    public Policy getPolicy(Long id) {
        return policyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Policy not found"));
    }

    // Update
    public Policy updatePolicy(Long id, Policy updatedPolicy) {
        Policy policy = getPolicy(id);
        policy.setName(updatedPolicy.getName());
        policy.setDescription(updatedPolicy.getDescription());
        policy.setPremium(updatedPolicy.getPremium());
        policy.setCoverage(updatedPolicy.getCoverage());
        policy.setUpdatedAt(LocalDateTime.now());
        return policyRepository.save(policy);
    }

    // Delete
    public void deletePolicy(Long id) {
        Policy policy = getPolicy(id);
        policyRepository.delete(policy);
    }
}
