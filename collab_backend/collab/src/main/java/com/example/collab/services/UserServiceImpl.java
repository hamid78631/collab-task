package com.example.collab.services;

import com.example.collab.dtos.UserDTO;
import com.example.collab.entities.User;
import com.example.collab.exceptions.UserNotFoundException;
import com.example.collab.mappers.UserMappers;
import com.example.collab.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@AllArgsConstructor
public class UserServiceImpl implements UserService{
    private UserRepository userRepository;
    private UserMappers dtoMapper   ;


    @Override
    public UserDTO saveUser(UserDTO userDTO) throws UserNotFoundException {

        if(userRepository.findByEmailOrName(userDTO.getEmail(), userDTO.getName()).isPresent()){
            throw new UserNotFoundException("Cet email est déja utilisé ! ");
        }
        User saveUser = dtoMapper.userDTOToUser(userDTO);
        userRepository.save(saveUser);
        return dtoMapper.userToUserDTO(saveUser) ;
    }

    @Override
    public UserDTO getUser(Long id) throws UserNotFoundException {
        User user = userRepository.findById(id).get();
        if(user == null){
            throw new UserNotFoundException("Cet utilisateur n'existe pas ");
        }else {
            return dtoMapper.userToUserDTO(user);
        }

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
    public UserDTO searchUser(String email, String name) throws UserNotFoundException {
         User user = userRepository.findByEmailOrName(email, name)
                .orElseThrow(() -> new UserNotFoundException("User not found "));
         return dtoMapper.userToUserDTO(user);
    }

    @Override
    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(user -> dtoMapper.userToUserDTO(user))
                .toList();
    }


}
