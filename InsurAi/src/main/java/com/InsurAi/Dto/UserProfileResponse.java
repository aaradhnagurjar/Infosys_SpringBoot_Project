package com.InsurAi.Dto;


import java.time.LocalDate;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserProfileResponse {
    private String name;
    private String email;
    private String phone;
    private String address;
    private String occupation;
    private LocalDate dateOfBirth;
    private String role;
}
