package com.portfolio.repository;

import com.portfolio.entity.Profile;
import com.portfolio.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {
    List<Profile> findByUser(User user);
    List<Profile> findByUserEmail(String email);
    Optional<Profile> findBySlug(String slug);
    Optional<Profile> findByNameIgnoreCase(String name);
}
