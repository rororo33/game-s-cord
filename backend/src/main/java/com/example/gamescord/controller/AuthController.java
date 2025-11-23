package com.example.gamescord.controller;

import com.example.gamescord.domain.RefreshToken;
import com.example.gamescord.dto.auth.TokenRefreshRequestDTO;
import com.example.gamescord.dto.auth.TokenRefreshResponseDTO;
import com.example.gamescord.security.JwtUtil;
import com.example.gamescord.service.refreshtoken.RefreshTokenService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final RefreshTokenService refreshTokenService;
    private final JwtUtil jwtUtil;

    // 리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody TokenRefreshRequestDTO request) {
        String requestRefreshToken = request.getRefreshToken();

        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String newAccessToken = jwtUtil.generateAccessToken(user.getLoginId());
                    return ResponseEntity.ok(new TokenRefreshResponseDTO(newAccessToken));
                })
                .orElseThrow(() -> new RuntimeException("Refresh token is not in database!"));
    }
}
