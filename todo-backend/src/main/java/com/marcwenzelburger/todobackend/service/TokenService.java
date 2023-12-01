package com.marcwenzelburger.todobackend.service;

import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Base64;
import java.util.Date;

@Component
public class TokenService {

    private final String secretKey;
    private String test;

    public TokenService(@Value("${jwt.secret}") String secretKey) {
        this.secretKey = secretKey;
    }

    public String createToken(String username) {
        long expirationTime = 864_000_000;
        return Jwts.builder()
                .setSubject(username)
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(SignatureAlgorithm.HS512, Base64.getDecoder().decode(secretKey))
                .compact();
    }

    public String extractUsername(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(Base64.getDecoder().decode(secretKey))
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (JwtException e) {

            return null;
        }
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(Base64.getDecoder().decode(secretKey))
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException e) {

            return false;
        }
    }
}
