package com.marcwenzelburger.todobackend.repository;

import com.marcwenzelburger.todobackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
public interface UserRepository extends JpaRepository<User, Integer> {
    User findByUserName(String username);
    User findByEmail(String email);
}
