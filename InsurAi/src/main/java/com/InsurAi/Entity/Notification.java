package com.InsurAi.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail;
    private String agentEmail;
    private String reason;
    private String message;

    private LocalDate date;   // appointment date
    private LocalTime time;   // appointment time

    @Enumerated(EnumType.STRING)
    private Status status;

    public enum Status {
        SENT, FAILED, PENDING
    }
}
