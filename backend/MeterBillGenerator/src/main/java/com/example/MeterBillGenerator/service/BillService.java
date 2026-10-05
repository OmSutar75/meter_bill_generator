package com.example.MeterBillGenerator.service;

import com.example.MeterBillGenerator.dto.BillDTO;
import com.example.MeterBillGenerator.entity.Bill;
import com.example.MeterBillGenerator.entity.User;
import com.example.MeterBillGenerator.repository.BillRepo;
import com.example.MeterBillGenerator.repository.UserRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BillService {

    private BillRepo billRepo;
    private UserRepo userRepo;

    public BillService(BillRepo billRepo, UserRepo userRepo) {
        this.billRepo = billRepo;
        this.userRepo = userRepo;
    }

    @Transactional
    public BillDTO save(BillDTO billDto, User u) {
        User user = userRepo.findByEmail(u.getEmail());
        System.out.println("user : " + user);
        if (user == null) {
            throw new RuntimeException("can't find pseron with eamil" + u.getEmail());
        }

        Bill bill = DtoToBill(billDto);
        bill.setUser(user);

        user.getBills().add(bill);
        System.out.println("user : " + user);
        return BilltoDto(billRepo.save(bill));
    }

    @Transactional(readOnly = true)
    public List<BillDTO> findAll(User user) {
        List<Bill> list = billRepo.findByUserEmail(user.getEmail());
        return list.stream().map(this::BilltoDto).toList();
    }

    private BillDTO BilltoDto(Bill save) {
        if (save == null) {
            return null;
        }
        BillDTO bill = new BillDTO();
        bill.setId(save.getId());
        bill.setTotalBill(save.getCalculatedPrice());
        bill.setNewReading(save.getNewReading());
        bill.setOldReading(save.getOldReading());
        bill.setGeneratedAt(save.getCreatedAt() != null ? save.getCreatedAt().toString() : LocalDateTime.now().toString());
        bill.setRatePerUnit(save.getPricePerUnit());
        bill.setUnitsConsumed(save.getTotalReading());
        return bill;
    }

    private Bill DtoToBill(BillDTO billDto) {
        if (billDto == null) {
            return null;
        }
        Bill bill = new Bill();
        bill.setOldReading(billDto.getOldReading());
        bill.setTotalReading(billDto.getUnitsConsumed());
        bill.setNewReading(billDto.getNewReading());
        bill.setPricePerUnit(billDto.getRatePerUnit());
        bill.setCalculatedPrice(billDto.getTotalBill());
        bill.setCreatedAt(LocalDateTime.now());
        return bill;
    }
}
