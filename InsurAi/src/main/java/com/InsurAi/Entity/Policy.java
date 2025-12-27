package com.InsurAi.Entity;


import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "policies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Policy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // Policy name

    @Column(length = 500)
    private String description; // Short description

    @Column(nullable = false)
    private Double premium; // Amount user pays

    @Column(nullable = false)
    private Double coverage; // Maximum coverage amount

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
