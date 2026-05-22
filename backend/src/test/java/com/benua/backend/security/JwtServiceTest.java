package com.benua.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private static final String SECRET = "test-secret-at-least-32-characters-long!";

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService(SECRET, 3_600_000L);
    }

    @Test
    void issueAndParseRoundTrip() {
        String token = jwtService.issue("alice", Set.of("ADMIN"));

        Claims claims = jwtService.parse(token);

        assertEquals("alice", claims.getSubject());
        assertNotNull(claims.getExpiration());
        assertTrue(claims.getExpiration().toInstant().isAfter(java.time.Instant.now()));
    }

    @Test
    void roleClaimIsPresent() {
        String token = jwtService.issue("bob", Set.of("EDITOR"));

        Claims claims = jwtService.parse(token);

        assertTrue(claims.get("roles", java.util.List.class).contains("EDITOR"));
    }

    @Test
    void parseInvalidTokenThrowsJwtException() {
        assertThrows(JwtException.class, () -> jwtService.parse("not.a.valid.token"));
    }

    @Test
    void parseExpiredTokenThrowsJwtException() throws InterruptedException {
        JwtService shortLived = new JwtService(SECRET, 1L);
        String token = shortLived.issue("alice", Set.of("ADMIN"));
        Thread.sleep(50);

        assertThrows(JwtException.class, () -> shortLived.parse(token));
    }

    @Test
    void getTtlMsReturnsConfiguredValue() {
        assertEquals(3_600_000L, jwtService.getTtlMs());
    }
}
