package com.portfolio.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "skills")
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    private Profile profile;

    public Skill() {}

    public Skill(Long id, String name, Profile profile) {
        this.id = id;
        this.name = name;
        this.profile = profile;
    }

    public static SkillBuilder builder() {
        return new SkillBuilder();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Profile getProfile() { return profile; }
    public void setProfile(Profile profile) { this.profile = profile; }

    @Override
    public String toString() {
        return "Skill{" +
                "id=" + id +
                ", name='" + name + '\'' +
                '}';
    }

    // Manual Builder
    public static class SkillBuilder {
        private Long id;
        private String name;
        private Profile profile;

        public SkillBuilder id(Long id) { this.id = id; return this; }
        public SkillBuilder name(String name) { this.name = name; return this; }
        public SkillBuilder profile(Profile profile) { this.profile = profile; return this; }

        public Skill build() {
            return new Skill(id, name, profile);
        }
    }
}
