package com.marcwenzelburger.todobackend.controller;

import com.marcwenzelburger.todobackend.dto.EditUserDto;
import com.marcwenzelburger.todobackend.dto.UserDto;
import com.marcwenzelburger.todobackend.entity.Role;
import com.marcwenzelburger.todobackend.entity.User;
import com.marcwenzelburger.todobackend.repository.RoleRepository;
import com.marcwenzelburger.todobackend.repository.UserRepository;
import com.marcwenzelburger.todobackend.service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/api")
public class HomeController {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private TokenService tokenService;

    @PostMapping("/auth/login")
    public ResponseEntity<?> authenticateUser(@RequestBody UserDto loginDto) {
        try {
            Authentication authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);


            String token = tokenService.createToken(loginDto.getUsername());

            loginDto.setToken(token);

            User user = userRepository.findByUserName(loginDto.getUsername());
            loginDto.setName(user.getName());
            loginDto.setEmail(user.getEmail());

            loginDto.setPassword(null);

            return new ResponseEntity<>(loginDto, HttpStatus.OK);

        } catch (AuthenticationException e) {
            System.out.println("test");
            return new ResponseEntity<>("Authentication failed!", HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/auth/signup")
    public ResponseEntity<?> registerUser(@RequestBody UserDto signUpDto) {
        if (userRepository.findByUserName(signUpDto.getUsername()) != null) {
            return new ResponseEntity<>("User already exists!", HttpStatus.BAD_REQUEST);
        }

        User user = new User();
        user.setName(signUpDto.getName());
        user.setUserName(signUpDto.getUsername());
        user.setEmail(signUpDto.getEmail());
        user.setPassword(passwordEncoder.encode(signUpDto.getPassword()));
        Role roles = roleRepository.findByName("ROLE_USER").get();
        user.setRoles(Collections.singleton(roles));

        String token = tokenService.createToken(signUpDto.getUsername());

        user.setToken(token);

        if (signUpDto.getUsername().equalsIgnoreCase("") || signUpDto.getPassword().equalsIgnoreCase("") || signUpDto.getEmail().equalsIgnoreCase("") || signUpDto.getName().equalsIgnoreCase("")) {
            return new ResponseEntity<>("Please fill in all fields!", HttpStatus.BAD_REQUEST);
        }


        userRepository.save(user);

        UserDto userDto = new UserDto();
        userDto.setName(user.getName());
        userDto.setUsername(user.getUserName());
        userDto.setEmail(user.getEmail());
        userDto.setToken(token);

        return new ResponseEntity<>(userDto, HttpStatus.OK);
    }

    @PutMapping("/auth/update")
    public ResponseEntity<?> updateUser(@RequestBody EditUserDto updateDto) {
        try {

            if (!tokenService.validateToken(updateDto.getToken())) {
                return new ResponseEntity<>("Invalid token!", HttpStatus.UNAUTHORIZED);
            }

            String usernameFromToken = tokenService.extractUsername(updateDto.getToken());
            User user = userRepository.findByUserName(usernameFromToken);
            if (user == null) {
                return new ResponseEntity<>("User not found!", HttpStatus.NOT_FOUND);
            }

            if (!passwordEncoder.matches(updateDto.getOldPassword(), user.getPassword())) {
                return new ResponseEntity<>("Old password does not match!", HttpStatus.BAD_REQUEST);
            }

            if (updateDto.getNewPassword() != null && !updateDto.getNewPassword().isEmpty()) {
                if (!updateDto.getNewPassword().equals(updateDto.getNewConfirmPassword())) {
                    return new ResponseEntity<>("New passwords do not match!", HttpStatus.BAD_REQUEST);
                }
                user.setPassword(passwordEncoder.encode(updateDto.getNewPassword()));
            }

            if (!updateDto.getNewUsername().isEmpty() && !updateDto.getNewUsername().equals(user.getUserName()) && userRepository.findByUserName(updateDto.getNewUsername()) == null) {
                user.setUserName(updateDto.getNewUsername());
            }

            if (!updateDto.getNewEmail().isEmpty() && !updateDto.getNewEmail().equals(user.getEmail()) && userRepository.findByEmail(updateDto.getNewEmail()) == null) {
                user.setEmail(updateDto.getNewEmail());
            }

            user.setName(updateDto.getName());


            userRepository.save(user);


            String newToken = tokenService.createToken(user.getUserName());


            UserDto responseDto = new UserDto();
            responseDto.setName(user.getName());
            responseDto.setUsername(user.getUserName());
            responseDto.setEmail(user.getEmail());
            responseDto.setToken(newToken);


            System.out.println(8);
            return new ResponseEntity<>(responseDto, HttpStatus.OK);
        } catch (Exception e) {

            System.out.println(9);
            return new ResponseEntity<>("Update failed due to an internal error!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}