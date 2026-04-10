package com.example.collab.repositories;

import com.example.collab.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {

    Optional<User> findByEmailOrName(String email ,String name);
    List<User> findByEmailContainingIgnoreCaseOrNameContainingIgnoreCase(String email, String name);
    Optional<User> findByEmail(String email);
}
