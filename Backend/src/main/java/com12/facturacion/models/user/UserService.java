package com12.facturacion.models.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserDTO registerUser (RegisterUserDTO registerUserDTO){

        if (userRepository.existsByUsername(registerUserDTO.username())){
            throw new RuntimeException("User already exists");
        }

        User user = new User();
        user.setUsername(registerUserDTO.username());
        user.setPassword(passwordEncoder.encode(registerUserDTO.password()));
        user.setRole(registerUserDTO.rol());

        User savedUser = userRepository.save(user);
        return new UserDTO(savedUser.getId(), savedUser.getUsername(), savedUser.getRole());
    }

    public void updateUser (Long userId, String newPassword, Rol rol){
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setRole(rol);
        userRepository.save(user);
    }

    public List<UserDTO> getAllUsers(){
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(user -> new UserDTO(user.getId(), user.getUsername(), user.getRole()))
                .toList();
    }

    public void deleteUser(Long userId){
        User user = userRepository.findById(userId).orElseThrow(()-> new RuntimeException("User not found"));
        userRepository.delete(user);
    }
}
