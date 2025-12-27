package com.InsurAi.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "user_policies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserPolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link to user who owns the policy
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // The agent who handled it
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_id", nullable = false)
    private User agent;

    @Column(nullable = false)
    private String policyName;

    @Column(nullable = false)
    private LocalDate policyStartDate;

    @Column(nullable = false)
    private LocalDate policyEndDate;

    // These are user-supplied fields (optional initially)
    private String address;
    private String nationalId;
    private Double annualIncome;
    private String nomineeName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PolicyStatus status = PolicyStatus.PENDING_DETAILS;

    public enum PolicyStatus {
        PENDING_DETAILS,  // Agent marked complete, user yet to fill info
        ACTIVE,           // User filled details, verified
        EXPIRED
    }
}
