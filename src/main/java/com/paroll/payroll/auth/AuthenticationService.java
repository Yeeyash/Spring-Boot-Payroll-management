package com.paroll.payroll.auth;

import com.paroll.payroll.user.User;
import com.paroll.payroll.config.JwtService;
import com.paroll.payroll.user.Role;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.security.web.webauthn.api.AuthenticatorResponse;
import org.springframework.stereotype.Service;

import com.paroll.payroll.user.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request){
        var user = User.builder()
                    .firstname(request.getFirstname())
                    .lastname(request.getLastname())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .role(Role.USER)
                    .build();
        repository.save(user);
        var jwToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
            .token(jwToken)
            .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request){
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(), request.getPassword())
        );
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found."));
        
        var jwTtoken = jwtService.generateToken(user);

        return AuthenticationResponse.builder()
            .token(jwTtoken).build();
    }


}
