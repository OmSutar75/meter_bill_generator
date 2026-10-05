package com.example.MeterBillGenerator.service;

import com.example.MeterBillGenerator.dto.UserDTO;
import com.example.MeterBillGenerator.entity.User;

import com.example.MeterBillGenerator.repository.UserRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;


@Service
public class UserService {
    private UserRepo userRepo;

    public UserService(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    @Transactional
    public User getUser(Long id){
        Optional<User> user = userRepo.findById(id);

        return user.get();
    }

    @Transactional
    public User deleteUser(Long id){
        Optional<User> deletedUser  =  userRepo.findById(id);
        if(deletedUser.isEmpty())
        {
            System.out.println("user not found");
            return null;
        }

        userRepo.delete(deletedUser.get());
        return deletedUser.get();
    }

    @Transactional
    public User updateUser(Long id,User user){
        Optional<User> userToUpdate  =  userRepo.findById(id);
        if(userToUpdate.isEmpty())
        {
            System.out.println("user not found");
            return null;
        }
        userToUpdate.get().setName(user.getName());
        userToUpdate.get().setPassword(user.getPassword());
        userToUpdate.get().setEmail(user.getEmail());
        userToUpdate.get().setBirthDate(user.getUpdatedAt());
        return userToUpdate.get();

    }

    @Transactional
    public List<User> getAllUsers() {
        List<User> list = userRepo.findAll();
        return list;
    }
    @Transactional
    public boolean isUserExist(String email) {
        User user = userRepo.findByEmail(email);

        return user != null;
    }



    @Transactional
    public UserDTO registerUser(UserDTO user) {
        User u = dtoToUser(user);
        u = userRepo.save(u);
        return userToDto(u);
    }

    private User dtoToUser(UserDTO u) {
        User user = new User();
        user.setEmail(u.getEmail());
        user.setName(u.getName());
        user.setPassword(u.getPassword());
        user.setCity(u.getCity());
        user.setBirthDate(u.getBirthDate());
        return user;
    }

    private UserDTO userToDto(User u) {
        UserDTO user = new UserDTO();
        user.setEmail(u.getEmail());
        user.setName(u.getName());
        user.setPassword(u.getPassword());
        user.setCity(u.getCity());
        user.setBirthDate(u.getBirthDate());
        return user;
    }

    public User findByEmail(String email) {

        User u = userRepo.findByEmail(email);
        return u;
    }

    public boolean verifyUserCredentials(String email, String password) {
        User user = findByEmail(email);
        return user != null && user.getPassword().equals(password);
    }
}
