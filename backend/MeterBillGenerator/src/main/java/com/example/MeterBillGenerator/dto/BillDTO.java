package com.example.MeterBillGenerator.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class BillDTO {

    private Long id;
    private String generatedAt;
    private double oldReading;
    private double newReading;
    private double unitsConsumed;
    private double ratePerUnit;
    private double totalBill;
}
