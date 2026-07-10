package com.portfolio.service;

import com.portfolio.dto.*;
import com.portfolio.entity.*;
import com.portfolio.repository.ProfileRepository;
import com.portfolio.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    public ProfileService(ProfileRepository profileRepository, UserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    // 1. Fetch all portfolios owned by a User Email
    @Transactional(readOnly = true)
    public List<ProfileDTO> getPortfoliosByUserEmail(String email) {
        List<Profile> profiles = profileRepository.findByUserEmail(email);
        return profiles.stream().map(this::convertToDTO).toList();
    }

    // 2. Fetch specific portfolio by Slug (unauthenticated public access)
    @Transactional(readOnly = true)
    public ProfileDTO getPortfolioBySlug(String slug) {
        Profile profile = profileRepository.findBySlug(slug)
                .orElseThrow(() -> new EntityNotFoundException("Portfolio not found for URL slug: " + slug));
        return convertToDTO(profile);
    }

    // 3. Fetch specific portfolio by ID and Email (secure ownership check)
    @Transactional(readOnly = true)
    public ProfileDTO getPortfolioByIdAndEmail(Long id, String email) {
        Profile profile = profileRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Portfolio not found with id: " + id));

        if (!profile.getUser().getEmail().equals(email)) {
            throw new IllegalArgumentException("Access Denied: You do not own this portfolio.");
        }
        return convertToDTO(profile);
    }

    // 4. Create a new Portfolio
    @Transactional
    public ProfileDTO createPortfolio(String email, ProfileDTO dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + email));

        // Generate and sanitize unique slug
        String rawSlug = dto.slug();
        if (rawSlug == null || rawSlug.trim().isEmpty()) {
            rawSlug = dto.name();
        }
        String slug = generateUniqueSlug(rawSlug);

        Profile profile = Profile.builder()
                .name(dto.name())
                .title(dto.title())
                .bio(dto.bio())
                .profileImageUrl(dto.profileImageUrl())
                .resumeUrl(dto.resumeUrl())
                .githubLink(dto.githubLink())
                .linkedinLink(dto.linkedinLink())
                .slug(slug)
                .backgroundColor(dto.backgroundColor())
                .roles(dto.roles())
                .email(dto.email())
                .phone(dto.phone())
                .fontFamily(dto.fontFamily())
                .avatarAnimation(dto.avatarAnimation())
                .user(user)
                .build();

        // Map child collections
        if (dto.skills() != null) {
            dto.skills().forEach(s -> profile.getSkills().add(Skill.builder().name(s.name()).profile(profile).build()));
        }
        if (dto.projects() != null) {
            dto.projects().forEach(p -> profile.getProjects().add(Project.builder()
                    .title(p.title())
                    .description(p.description())
                    .techStack(p.techStack())
                    .githubLink(p.githubLink())
                    .liveLink(p.liveLink())
                    .profile(profile)
                    .build()));
        }
        if (dto.experiences() != null) {
            dto.experiences().forEach(e -> profile.getExperiences().add(Experience.builder()
                    .company(e.company())
                    .role(e.role())
                    .startDate(e.startDate())
                    .endDate(e.endDate())
                    .description(e.description())
                    .mediaUrl(e.mediaUrl())
                    .profile(profile)
                    .build()));
        }
        if (dto.certificates() != null) {
            dto.certificates().forEach(c -> profile.getCertificates().add(Certificate.builder()
                    .name(c.name())
                    .issuingOrganization(c.issuingOrganization())
                    .issueDate(c.issueDate())
                    .credentialUrl(c.credentialUrl())
                    .description(c.description())
                    .filePath(c.filePath())
                    .profile(profile)
                    .build()));
        }
        if (dto.educations() != null) {
            dto.educations().forEach(ed -> profile.getEducations().add(Education.builder()
                    .degreeName(ed.degreeName())
                    .institution(ed.institution())
                    .timeline(ed.timeline())
                    .gradeOrCgpa(ed.gradeOrCgpa())
                    .profile(profile)
                    .build()));
        }
        if (dto.achievements() != null) {
            dto.achievements().forEach(a -> profile.getAchievements().add(Achievement.builder()
                    .title(a.title())
                    .associatedDate(a.associatedDate())
                    .description(a.description())
                    .mediaUrl(a.mediaUrl())
                    .profile(profile)
                    .build()));
        }

        Profile saved = profileRepository.save(profile);
        return convertToDTO(saved);
    }

    // 5. Update a specific Portfolio
    @Transactional
    public ProfileDTO updatePortfolio(String email, Long id, ProfileDTO dto) {
        Profile profile = profileRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Portfolio not found with id: " + id));

        if (!profile.getUser().getEmail().equals(email)) {
            throw new IllegalArgumentException("Access Denied: You do not own this portfolio.");
        }

        profile.setName(dto.name());
        profile.setTitle(dto.title());
        profile.setBio(dto.bio());
        profile.setProfileImageUrl(dto.profileImageUrl());
        profile.setResumeUrl(dto.resumeUrl());
        profile.setGithubLink(dto.githubLink());
        profile.setLinkedinLink(dto.linkedinLink());
        profile.setBackgroundColor(dto.backgroundColor());
        profile.setRoles(dto.roles());
        profile.setEmail(dto.email());
        profile.setPhone(dto.phone());
        profile.setFontFamily(dto.fontFamily());
        profile.setAvatarAnimation(dto.avatarAnimation());

        // Update slug if modified, maintaining uniqueness
        if (dto.slug() != null && !dto.slug().trim().isEmpty() && !dto.slug().equals(profile.getSlug())) {
            profile.setSlug(generateUniqueSlug(dto.slug()));
        }

        // Sync child lists safely
        profile.getSkills().clear();
        if (dto.skills() != null) {
            dto.skills().forEach(s -> profile.getSkills().add(Skill.builder().name(s.name()).profile(profile).build()));
        }

        profile.getProjects().clear();
        if (dto.projects() != null) {
            dto.projects().forEach(p -> profile.getProjects().add(Project.builder()
                    .title(p.title())
                    .description(p.description())
                    .techStack(p.techStack())
                    .githubLink(p.githubLink())
                    .liveLink(p.liveLink())
                    .profile(profile)
                    .build()));
        }

        profile.getExperiences().clear();
        if (dto.experiences() != null) {
            dto.experiences().forEach(e -> profile.getExperiences().add(Experience.builder()
                    .company(e.company())
                    .role(e.role())
                    .startDate(e.startDate())
                    .endDate(e.endDate())
                    .description(e.description())
                    .mediaUrl(e.mediaUrl())
                    .profile(profile)
                    .build()));
        }

        profile.getCertificates().clear();
        if (dto.certificates() != null) {
            dto.certificates().forEach(c -> profile.getCertificates().add(Certificate.builder()
                    .name(c.name())
                    .issuingOrganization(c.issuingOrganization())
                    .issueDate(c.issueDate())
                    .credentialUrl(c.credentialUrl())
                    .description(c.description())
                    .filePath(c.filePath())
                    .profile(profile)
                    .build()));
        }

        profile.getEducations().clear();
        if (dto.educations() != null) {
            dto.educations().forEach(ed -> profile.getEducations().add(Education.builder()
                    .degreeName(ed.degreeName())
                    .institution(ed.institution())
                    .timeline(ed.timeline())
                    .gradeOrCgpa(ed.gradeOrCgpa())
                    .profile(profile)
                    .build()));
        }

        profile.getAchievements().clear();
        if (dto.achievements() != null) {
            dto.achievements().forEach(a -> profile.getAchievements().add(Achievement.builder()
                    .title(a.title())
                    .associatedDate(a.associatedDate())
                    .description(a.description())
                    .mediaUrl(a.mediaUrl())
                    .profile(profile)
                    .build()));
        }

        Profile saved = profileRepository.save(profile);
        return convertToDTO(saved);
    }

    // Helper: generate a URL-safe, unique slug
    private String generateUniqueSlug(String raw) {
        String base = raw.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "") // Remove special characters
                .replaceAll("\\s+", "-")          // Replace spaces with hyphens
                .replaceAll("-+", "-")            // Collapse duplicate hyphens
                .trim();
        if (base.isEmpty()) {
            base = "portfolio";
        }

        String unique = base;
        int count = 1;
        while (profileRepository.findBySlug(unique).isPresent()) {
            unique = base + "-" + count;
            count++;
        }
        return unique;
    }

    // Helper: Map JPA Entity tree down into flat DTO records
    public ProfileDTO convertToDTO(Profile profile) {
        List<SkillDTO> skillDTOs = profile.getSkills().stream()
                .map(s -> new SkillDTO(s.getId(), s.getName()))
                .toList();

        List<ProjectDTO> projectDTOs = profile.getProjects().stream()
                .map(p -> new ProjectDTO(
                        p.getId(),
                        p.getTitle(),
                        p.getDescription(),
                        p.getTechStack(),
                        p.getGithubLink(),
                        p.getLiveLink()
                ))
                .toList();

        List<ExperienceDTO> experienceDTOs = profile.getExperiences().stream()
                .map(e -> new ExperienceDTO(
                        e.getId(),
                        e.getCompany(),
                        e.getRole(),
                        e.getStartDate(),
                        e.getEndDate(),
                        e.getDescription(),
                        e.getMediaUrl()
                ))
                .toList();

        List<CertificateDTO> certificateDTOs = profile.getCertificates().stream()
                .map(c -> new CertificateDTO(
                        c.getId(),
                        c.getName(),
                        c.getIssuingOrganization(),
                        c.getIssueDate(),
                        c.getCredentialUrl(),
                        c.getDescription(),
                        c.getFilePath()
                ))
                .toList();

        List<EducationDTO> educationDTOs = profile.getEducations().stream()
                .map(ed -> new EducationDTO(
                        ed.getId(),
                        ed.getDegreeName(),
                        ed.getInstitution(),
                        ed.getTimeline(),
                        ed.getGradeOrCgpa()
                ))
                .toList();

        List<AchievementDTO> achievementDTOs = profile.getAchievements().stream()
                .map(a -> new AchievementDTO(
                        a.getId(),
                        a.getTitle(),
                        a.getAssociatedDate(),
                        a.getDescription(),
                        a.getMediaUrl()
                ))
                .toList();

        return new ProfileDTO(
                profile.getId(),
                profile.getName(),
                profile.getTitle(),
                profile.getBio(),
                profile.getProfileImageUrl(),
                profile.getResumeUrl(),
                profile.getGithubLink(),
                profile.getLinkedinLink(),
                profile.getSlug(),
                profile.getBackgroundColor(),
                profile.getRoles(),
                profile.getEmail(),
                profile.getPhone(),
                profile.getFontFamily(),
                profile.getAvatarAnimation(),
                skillDTOs,
                projectDTOs,
                experienceDTOs,
                certificateDTOs,
                educationDTOs,
                achievementDTOs
        );
    }

    // 6. Delete a specific Portfolio
    @Transactional
    public void deletePortfolio(String email, Long id) {
        Profile profile = profileRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Portfolio not found with id: " + id));

        if (!profile.getUser().getEmail().equals(email)) {
            throw new IllegalArgumentException("Access Denied: You do not own this portfolio.");
        }
        profileRepository.delete(profile);
    }
}
