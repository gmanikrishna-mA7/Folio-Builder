package com.portfolio.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "tech_stack", nullable = false)
    private String techStack;

    @Column(name = "github_link")
    private String githubLink;

    @Column(name = "live_link")
    private String liveLink;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    private Profile profile;

    public Project() {}

    public Project(Long id, String title, String description, String techStack, String githubLink, String liveLink, Profile profile) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.techStack = techStack;
        this.githubLink = githubLink;
        this.liveLink = liveLink;
        this.profile = profile;
    }

    public static ProjectBuilder builder() {
        return new ProjectBuilder();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getTechStack() { return techStack; }
    public void setTechStack(String techStack) { this.techStack = techStack; }

    public String getGithubLink() { return githubLink; }
    public void setGithubLink(String githubLink) { this.githubLink = githubLink; }

    public String getLiveLink() { return liveLink; }
    public void setLiveLink(String liveLink) { this.liveLink = liveLink; }

    public Profile getProfile() { return profile; }
    public void setProfile(Profile profile) { this.profile = profile; }

    @Override
    public String toString() {
        return "Project{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", techStack='" + techStack + '\'' +
                ", githubLink='" + githubLink + '\'' +
                ", liveLink='" + liveLink + '\'' +
                '}';
    }

    // Manual Builder
    public static class ProjectBuilder {
        private Long id;
        private String title;
        private String description;
        private String techStack;
        private String githubLink;
        private String liveLink;
        private Profile profile;

        public ProjectBuilder id(Long id) { this.id = id; return this; }
        public ProjectBuilder title(String title) { this.title = title; return this; }
        public ProjectBuilder description(String description) { this.description = description; return this; }
        public ProjectBuilder techStack(String techStack) { this.techStack = techStack; return this; }
        public ProjectBuilder githubLink(String githubLink) { this.githubLink = githubLink; return this; }
        public ProjectBuilder liveLink(String liveLink) { this.liveLink = liveLink; return this; }
        public ProjectBuilder profile(Profile profile) { this.profile = profile; return this; }

        public Project build() {
            return new Project(id, title, description, techStack, githubLink, liveLink, profile);
        }
    }
}
