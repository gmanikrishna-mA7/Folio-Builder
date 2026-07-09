package com.portfolio.controller;

import com.portfolio.dto.ProfileDTO;
import com.portfolio.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    // 1. List all portfolios for the authenticated user
    @GetMapping("/profile/list")
    public ResponseEntity<List<ProfileDTO>> getPortfolios(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(profileService.getPortfoliosByUserEmail(email));
    }

    // 2. Fetch specific portfolio by ID (for edit loading)
    @GetMapping("/profile/{id}")
    public ResponseEntity<ProfileDTO> getPortfolioById(Authentication authentication, @PathVariable Long id) {
        String email = authentication.getName();
        return ResponseEntity.ok(profileService.getPortfolioByIdAndEmail(id, email));
    }

    // 3. Create a new portfolio
    @PostMapping("/profile")
    public ResponseEntity<ProfileDTO> createPortfolio(
            Authentication authentication,
            @Valid @RequestBody ProfileDTO profileDTO
    ) {
        String email = authentication.getName();
        return ResponseEntity.ok(profileService.createPortfolio(email, profileDTO));
    }

    // 4. Update secure portfolio by ID
    @PutMapping("/profile/{id}")
    public ResponseEntity<ProfileDTO> updatePortfolio(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody ProfileDTO profileDTO
    ) {
        String email = authentication.getName();
        return ResponseEntity.ok(profileService.updatePortfolio(email, id, profileDTO));
    }

    // 5. Unsecured Public Endpoint (Fetches portfolio by unique slug)
    @GetMapping("/public/portfolio/{slug}")
    public ResponseEntity<ProfileDTO> getPublicPortfolio(@PathVariable String slug) {
        ProfileDTO profileDTO = profileService.getPortfolioBySlug(slug);
        return ResponseEntity.ok(profileDTO);
    }

    // 6. Delete secure portfolio by ID
    @DeleteMapping("/profile/{id}")
    public ResponseEntity<Void> deletePortfolio(Authentication authentication, @PathVariable Long id) {
        String email = authentication.getName();
        profileService.deletePortfolio(email, id);
        return ResponseEntity.noContent().build();
    }
}
