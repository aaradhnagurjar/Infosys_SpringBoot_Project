package com.InsurAi.Dto;

import java.time.LocalDate;

import com.InsurAi.Entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data                     // ✅ generates getters, setters, toString, equals, hashCode
@NoArgsConstructor        // ✅ generates a no-args constructor
@AllArgsConstructor       // ✅ generates an all-args constructor
public class SignupRequest {
    private String name;
    private String email;
    private String password;
    private User.Role role;
    private String number;      // optional
    private String address;     // optional
    private LocalDate dateOfBirth; // optional
}
