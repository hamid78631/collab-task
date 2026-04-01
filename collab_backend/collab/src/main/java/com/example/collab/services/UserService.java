package com.example.collab.services;

import com.example.collab.dtos.UserDTO;
import com.example.collab.entities.User;
import com.example.collab.exceptions.UserAlreadyExistsException;
import com.example.collab.exceptions.UserNotFoundException;

import java.util.List;

public interface UserService {

    UserDTO saveUser(UserDTO userDTO) throws UserAlreadyExistsException;

    UserDTO getUser(Long id) throws UserNotFoundException;

    UserDTO updateUser(Long id, UserDTO userDetails) throws UserNotFoundException;
    UserDTO deleteUser(Long id) throws UserNotFoundException;
    List<UserDTO> searchUser(String email , String name) throws UserNotFoundException;

    List<UserDTO> getAllUsers();
}
