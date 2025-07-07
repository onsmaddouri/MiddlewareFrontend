package com.bezkoder.springjwt.service;

import com.bezkoder.springjwt.models.User;
import java.util.List;

public interface IUserService {
    User saveUser(User user);
    List<User> getAllUsers();
    User getUserById(Long id);
    void deleteUser(Long id);
    long countAllUsers();

}
