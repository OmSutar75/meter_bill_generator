package com.example.MeterBillGenerator.controller;

import com.example.MeterBillGenerator.dto.BillDTO;
import com.example.MeterBillGenerator.entity.User;
import com.example.MeterBillGenerator.repository.UserRepo;
import com.example.MeterBillGenerator.service.BillService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
//@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequestMapping("/api/bills")
public class BillController {

    private final BillService billService;
    private final UserRepo userRepo;

    public BillController(BillService billService, UserRepo userRepo) {
        this.billService = billService;
        this.userRepo = userRepo;
    }

    // Helper method to resolve current logged-in user dynamically
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new RuntimeException("Unauthorized: No active login session found.");
        }

        String loggedInEmail = authentication.getName();
        User user = userRepo.findByEmail(loggedInEmail);

        if (user == null) {
            throw new RuntimeException("User not found for email: " + loggedInEmail);
        }

        return user;
    }

    @PostMapping
    public ResponseEntity<BillDTO> createBill(@RequestBody BillDTO billDto) {
        User currentUser = getCurrentUser();
        BillDTO savedBill = billService.save(billDto, currentUser);

        if (savedBill != null) {
            return new ResponseEntity<>(savedBill, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
    }

    @GetMapping
    public ResponseEntity<List<BillDTO>> getBills() {
        User currentUser = getCurrentUser();
        List<BillDTO> list = this.billService.findAll(currentUser);

        if (list == null || list.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<>(list, HttpStatus.OK);
    }
}