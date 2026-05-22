package com.benua.backend.migration;

import com.benua.backend.model.User;
import com.benua.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Set;

@Component
@Order(3)
public class AdminUserBootstrap implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminUserBootstrap.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.bootstrap.username:}")
    private String adminUsername;

    @Value("${app.admin.bootstrap.password:}")
    private String adminPassword;

    public AdminUserBootstrap(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (adminUsername == null || adminUsername.isBlank()) {
            log.warn("ADMIN_USERNAME not set — skipping admin bootstrap");
            return;
        }
        if (adminPassword == null || adminPassword.isBlank()) {
            log.warn("ADMIN_PASSWORD not set — skipping admin bootstrap");
            return;
        }
        if (userRepository.existsByUsername(adminUsername)) {
            log.info("Admin user '{}' already exists, skipping bootstrap", adminUsername);
            return;
        }
        Instant now = Instant.now();
        userRepository.save(new User(null, adminUsername, passwordEncoder.encode(adminPassword),
                Set.of(User.Role.ADMIN), now, now));
        log.info("Bootstrap admin user '{}' created", adminUsername);
    }
}
