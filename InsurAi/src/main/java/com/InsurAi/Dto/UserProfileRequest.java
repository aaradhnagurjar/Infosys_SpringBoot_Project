package com.InsurAi.Dto;


import java.time.LocalDate;
import lombok.Data;

@Data
public class UserProfileRequest {
    private String name;
    private String phone;
    private String address;
    private String occupation;
    private LocalDate dateOfBirth;
}
