package com.example.collab.web;


import com.example.collab.dtos.UserDTO;
import com.example.collab.entities.User;
import com.example.collab.exceptions.UserNotFoundException;
import com.example.collab.services.UserService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Transactional
@RestController
@AllArgsConstructor
@RequestMapping("/api")
public class UserController {
    UserService userService;

    @GetMapping("/users")
    public List<UserDTO> getUsers(){
        return userService.getAllUsers();
    }

    @GetMapping("/users/{id}")
    public UserDTO getUser(@PathVariable Long id) throws UserNotFoundException {
        return userService.getUser(id);
    }

    @GetMapping("/users/search")
    public UserDTO searchUser(@RequestParam(name = "email", required = false) String email,
                              @RequestParam(name = "name", required = false) String name) throws UserNotFoundException {
        return userService.searchUser(email, name);
    }

    @PostMapping("/users")
    public UserDTO createUser(@RequestBody UserDTO userDTO) throws UserNotFoundException {
        return userService.saveUser(userDTO);
    }

    @PutMapping("/users/{id}")

    public UserDTO updateUser(@PathVariable Long id , @RequestBody UserDTO userDTO) throws UserNotFoundException {
        return userService.updateUser(id , userDTO);
    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id) throws UserNotFoundException {
         userService.deleteUser(id);
    }

}
