package com.example.collab.services;

import com.example.collab.dtos.UserDTO;
import com.example.collab.entities.User;
import com.example.collab.exceptions.UserAlreadyExistsException;
import com.example.collab.exceptions.UserNotFoundException;
import com.example.collab.mappers.UserMappers;
import com.example.collab.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@Transactional
@AllArgsConstructor
public class UserServiceImpl implements UserService{
    private UserRepository userRepository;
    private UserMappers dtoMapper   ;


    @Override
    public UserDTO saveUser(UserDTO userDTO) throws UserAlreadyExistsException {

        if (userDTO.getEmail() == null || userDTO.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("L'email ne peut pas être vide");
        }
        
        if (userDTO.getName() == null || userDTO.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Le nom ne peut pas être vide");
        }

        if(userRepository.findByEmailOrName(userDTO.getEmail(), userDTO.getName()).isPresent()){
            throw new UserAlreadyExistsException("Cet email est déjà utilisé !");
        }
        User saveUser = dtoMapper.userDTOToUser(userDTO);
        userRepository.save(saveUser);
        return dtoMapper.userToUserDTO(saveUser) ;
    }

    @Override
    public UserDTO getUser(Long id) throws UserNotFoundException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Cet utilisateur n'existe pas"));
        return dtoMapper.userToUserDTO(user);
    }


    @Override
    public UserDTO updateUser(Long id, UserDTO userDetails) throws UserNotFoundException {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        user.setName(userDetails.getName());
        user.setEmail(userDetails.getEmail());
        user.setAvatarUrl(userDetails.getAvatarUrl());
        User updatedUser = userRepository.save(user);

        return dtoMapper.userToUserDTO(updatedUser);
    }

    @Override
    public UserDTO deleteUser(Long id) throws UserNotFoundException {
        User user = userRepository.findById(id).orElseThrow(()-> new UserNotFoundException("User not found"));
        userRepository.delete(user);
        return dtoMapper.userToUserDTO(user);
    }

    @Override
    public List<UserDTO> searchUser(String email, String name) throws UserNotFoundException {
        List<User> users;
        
        if (email != null && name != null) {
            users = userRepository.findByEmailContainingIgnoreCaseOrNameContainingIgnoreCase(email, name);
        } else if (email != null) {
            users = userRepository.findByEmailContainingIgnoreCaseOrNameContainingIgnoreCase(email, "");
        } else if (name != null) {
            users = userRepository.findByEmailContainingIgnoreCaseOrNameContainingIgnoreCase("", name);
        } else {
            throw new UserNotFoundException("Veuillez fournir un email ou un nom pour la recherche");
        }
        
        if (users.isEmpty()) {
            throw new UserNotFoundException("Aucun utilisateur trouvé pour les critères spécifiés");
        }
        
        return users.stream()
                .map(user -> dtoMapper.userToUserDTO(user))
                .toList();
    }


    @Override
    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(user -> dtoMapper.userToUserDTO(user))
                .toList();
    }


}
