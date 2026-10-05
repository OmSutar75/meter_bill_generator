package com.example.MeterBillGenerator.dto;

import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class UserDTO {
    private String name;
    private String password;
    private String email;
    private String city;
    private LocalDateTime birthDate;
}
