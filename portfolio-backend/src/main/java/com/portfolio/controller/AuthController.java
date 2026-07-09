package com.portfolio.controller;

import com.portfolio.dto.AuthRequest;
import com.portfolio.dto.AuthResponse;
import com.portfolio.entity.Profile;
import com.portfolio.entity.User;
import com.portfolio.repository.ProfileRepository;
import com.portfolio.repository.UserRepository;
import com.portfolio.security.JwtUtils;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "https://foliobuilder.vercel.app")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @org.springframework.beans.factory.annotation.Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    public AuthController(
            UserRepository userRepository,
            ProfileRepository profileRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtUtils jwtUtils
    ) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    // 1. User Registration Gateway
    @PostMapping("/register")
    @Transactional
    public ResponseEntity<?> registerUser(@Valid @RequestBody AuthRequest registrationRequest) {
        if (userRepository.findByEmail(registrationRequest.email()).isPresent()) {
            throw new IllegalArgumentException("An account is already registered with this email address");
        }

        // Create and save User
        User user = new User();
        user.setEmail(registrationRequest.email());
        user.setPassword(passwordEncoder.encode(registrationRequest.password()));
        user.setRole("ROLE_USER");
        User savedUser = userRepository.save(user);

        // Pre-initialize a blank Profile for the user
        String defaultName = registrationRequest.email().split("@")[0];
        Profile profile = Profile.builder()
                .name(defaultName)
                .title("New Developer")
                .bio("I am ready to build my portfolio.")
                .slug(defaultName) // Set initial slug
                .user(savedUser)
                .build();
        profileRepository.save(profile);

        return ResponseEntity.ok("Registration completed successfully. You can now login.");
    }

    // 2. User Authentication Gateway
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticateUser(@Valid @RequestBody AuthRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.email(),
                        loginRequest.password()
                )
        );

        User user = userRepository.findByEmail(loginRequest.email())
                .orElseThrow(() -> new IllegalArgumentException("Invalid login credentials"));

        String jwtToken = jwtUtils.generateToken(user.getEmail());

        return ResponseEntity.ok(new AuthResponse(
                jwtToken,
                user.getEmail(),
                user.getRole()
        ));
    }

    // 3. Mock Google OAuth Login for local development/testing without real credentials
    @GetMapping("/google/mock")
    public void mockGoogleLogin(jakarta.servlet.http.HttpServletResponse response) throws java.io.IOException {
        String mockEmail = "google.user@gmail.com";
        
        // Find or create the mock Google user
        User user = userRepository.findByEmail(mockEmail).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(mockEmail);
            newUser.setPassword(passwordEncoder.encode(java.util.UUID.randomUUID().toString()));
            newUser.setRole("ROLE_USER");
            User savedUser = userRepository.save(newUser);

            // Pre-initialize a blank Profile for the user
            Profile profile = Profile.builder()
                    .name("Google User")
                    .title("Google Developer")
                    .bio("Logged in via Google Authentication.")
                    .slug("google-user")
                    .user(savedUser)
                    .build();
            profileRepository.save(profile);
            return savedUser;
        });

        // Generate JWT token
        String token = jwtUtils.generateToken(user.getEmail());
        
        // Redirect back to frontend OAuth2 redirect handler
        response.sendRedirect(frontendUrl + "/oauth2/redirect?token=" + token);
    }
}
