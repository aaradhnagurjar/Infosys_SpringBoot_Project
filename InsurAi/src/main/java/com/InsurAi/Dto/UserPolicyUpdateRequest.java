package com.InsurAi.Dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserPolicyUpdateRequest {
    private String address;
    private String nationalId;
    private Double annualIncome;
    private String nomineeName;
}
