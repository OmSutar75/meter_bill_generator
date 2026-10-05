package com.example.MeterBillGenerator.repository;

import com.example.MeterBillGenerator.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;



@Repository
public interface UserRepo extends JpaRepository<User,Long> {
    User findByEmail(String email);
}
