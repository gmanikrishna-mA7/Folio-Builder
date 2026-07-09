package com.portfolio.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "profiles")
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "profile_image_url")
    private String profileImageUrl;

    @Column(name = "resume_url")
    private String resumeUrl;

    @Column(name = "github_link")
    private String githubLink;

    @Column(name = "linkedin_link")
    private String linkedinLink;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(name = "background_color")
    private String backgroundColor;

    private String roles;

    private String email;

    private String phone;

    @Column(name = "font_family")
    private String fontFamily = "sans";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<Skill> skills = new ArrayList<>();

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<Project> projects = new ArrayList<>();

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<Experience> experiences = new ArrayList<>();

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<Certificate> certificates = new ArrayList<>();

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<Education> educations = new ArrayList<>();

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<Achievement> achievements = new ArrayList<>();

    public Profile() {}

    public Profile(Long id, String name, String title, String bio, String profileImageUrl, String resumeUrl, String githubLink, String linkedinLink, String slug, String backgroundColor, String roles, String email, String phone, String fontFamily, User user, List<Skill> skills, List<Project> projects, List<Experience> experiences, List<Certificate> certificates, List<Education> educations, List<Achievement> achievements) {
        this.id = id;
        this.name = name;
        this.title = title;
        this.bio = bio;
        this.profileImageUrl = profileImageUrl;
        this.resumeUrl = resumeUrl;
        this.githubLink = githubLink;
        this.linkedinLink = linkedinLink;
        this.slug = slug;
        this.backgroundColor = backgroundColor;
        this.roles = roles;
        this.email = email;
        this.phone = phone;
        this.fontFamily = fontFamily != null ? fontFamily : "sans";
        this.user = user;
        if (skills != null) this.skills = skills;
        if (projects != null) this.projects = projects;
        if (experiences != null) this.experiences = experiences;
        if (certificates != null) this.certificates = certificates;
        if (educations != null) this.educations = educations;
        if (achievements != null) this.achievements = achievements;
    }

    public static ProfileBuilder builder() {
        return new ProfileBuilder();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getProfileImageUrl() { return profileImageUrl; }
    public void setProfileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; }

    public String getResumeUrl() { return resumeUrl; }
    public void setResumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; }

    public String getGithubLink() { return githubLink; }
    public void setGithubLink(String githubLink) { this.githubLink = githubLink; }

    public String getLinkedinLink() { return linkedinLink; }
    public void setLinkedinLink(String linkedinLink) { this.linkedinLink = linkedinLink; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getBackgroundColor() { return backgroundColor; }
    public void setBackgroundColor(String backgroundColor) { this.backgroundColor = backgroundColor; }

    public String getRoles() { return roles; }
    public void setRoles(String roles) { this.roles = roles; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getFontFamily() { return fontFamily; }
    public void setFontFamily(String fontFamily) { this.fontFamily = fontFamily; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public List<Skill> getSkills() { return skills; }
    public void setSkills(List<Skill> skills) { this.skills = skills; }

    public List<Project> getProjects() { return projects; }
    public void setProjects(List<Project> projects) { this.projects = projects; }

    public List<Experience> getExperiences() { return experiences; }
    public void setExperiences(List<Experience> experiences) { this.experiences = experiences; }

    public List<Certificate> getCertificates() { return certificates; }
    public void setCertificates(List<Certificate> certificates) { this.certificates = certificates; }

    public List<Education> getEducations() { return educations; }
    public void setEducations(List<Education> educations) { this.educations = educations; }

    public List<Achievement> getAchievements() { return achievements; }
    public void setAchievements(List<Achievement> achievements) { this.achievements = achievements; }

    @Override
    public String toString() {
        return "Profile{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", title='" + title + '\'' +
                ", bio='" + bio + '\'' +
                ", profileImageUrl='" + profileImageUrl + '\'' +
                ", resumeUrl='" + resumeUrl + '\'' +
                ", githubLink='" + githubLink + '\'' +
                ", linkedinLink='" + linkedinLink + '\'' +
                ", slug='" + slug + '\'' +
                ", backgroundColor='" + backgroundColor + '\'' +
                ", roles='" + roles + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", fontFamily='" + fontFamily + '\'' +
                '}';
    }

    // Manual Builder
    public static class ProfileBuilder {
        private Long id;
        private String name;
        private String title;
        private String bio;
        private String profileImageUrl;
        private String resumeUrl;
        private String githubLink;
        private String linkedinLink;
        private String slug;
        private String backgroundColor;
        private String roles;
        private String email;
        private String phone;
        private String fontFamily;
        private User user;
        private List<Skill> skills = new ArrayList<>();
        private List<Project> projects = new ArrayList<>();
        private List<Experience> experiences = new ArrayList<>();
        private List<Certificate> certificates = new ArrayList<>();
        private List<Education> educations = new ArrayList<>();
        private List<Achievement> achievements = new ArrayList<>();

        public ProfileBuilder id(Long id) { this.id = id; return this; }
        public ProfileBuilder name(String name) { this.name = name; return this; }
        public ProfileBuilder title(String title) { this.title = title; return this; }
        public ProfileBuilder bio(String bio) { this.bio = bio; return this; }
        public ProfileBuilder profileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; return this; }
        public ProfileBuilder resumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; return this; }
        public ProfileBuilder githubLink(String githubLink) { this.githubLink = githubLink; return this; }
        public ProfileBuilder linkedinLink(String linkedinLink) { this.linkedinLink = linkedinLink; return this; }
        public ProfileBuilder slug(String slug) { this.slug = slug; return this; }
        public ProfileBuilder backgroundColor(String backgroundColor) { this.backgroundColor = backgroundColor; return this; }
        public ProfileBuilder roles(String roles) { this.roles = roles; return this; }
        public ProfileBuilder email(String email) { this.email = email; return this; }
        public ProfileBuilder phone(String phone) { this.phone = phone; return this; }
        public ProfileBuilder fontFamily(String fontFamily) { this.fontFamily = fontFamily; return this; }
        public ProfileBuilder user(User user) { this.user = user; return this; }
        public ProfileBuilder skills(List<Skill> skills) { this.skills = skills; return this; }
        public ProfileBuilder projects(List<Project> projects) { this.projects = projects; return this; }
        public ProfileBuilder experiences(List<Experience> experiences) { this.experiences = experiences; return this; }
        public ProfileBuilder certificates(List<Certificate> certificates) { this.certificates = certificates; return this; }
        public ProfileBuilder educations(List<Education> educations) { this.educations = educations; return this; }
        public ProfileBuilder achievements(List<Achievement> achievements) { this.achievements = achievements; return this; }

        public Profile build() {
            return new Profile(id, name, title, bio, profileImageUrl, resumeUrl, githubLink, linkedinLink, slug, backgroundColor, roles, email, phone, fontFamily, user, skills, projects, experiences, certificates, educations, achievements);
        }
    }
}
