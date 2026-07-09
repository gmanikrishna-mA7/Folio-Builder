package com.portfolio.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role; // e.g., ROLE_USER, ROLE_ADMIN

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Profile> profiles = new ArrayList<>();

    public User() {}

    public User(Long id, String email, String password, String role, List<Profile> profiles) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.role = role;
        if (profiles != null) this.profiles = profiles;
    }

    public static UserBuilder builder() {
        return new UserBuilder();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public List<Profile> getProfiles() { return profiles; }
    public void setProfiles(List<Profile> profiles) { this.profiles = profiles; }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", role='" + role + '\'' +
                '}';
    }

    // Manual Builder
    public static class UserBuilder {
        private Long id;
        private String email;
        private String password;
        private String role;
        private List<Profile> profiles = new ArrayList<>();

        public UserBuilder id(Long id) { this.id = id; return this; }
        public UserBuilder email(String email) { this.email = email; return this; }
        public UserBuilder password(String password) { this.password = password; return this; }
        public UserBuilder role(String role) { this.role = role; return this; }
        public UserBuilder profiles(List<Profile> profiles) { this.profiles = profiles; return this; }

        public User build() {
            return new User(id, email, password, role, profiles);
        }
    }
}
