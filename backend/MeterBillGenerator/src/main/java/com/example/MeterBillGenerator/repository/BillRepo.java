package com.example.MeterBillGenerator.repository;

import com.example.MeterBillGenerator.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillRepo extends JpaRepository<Bill,Long> {
    List<Bill> findByUserEmail(String email);
}
