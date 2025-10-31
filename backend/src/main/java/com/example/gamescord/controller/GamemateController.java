package com.example.gamescord.controller;

import com.example.gamescord.dto.gamemate.GamemateRegistrationRequestDTO;
import com.example.gamescord.dto.gamemate.GamemateResponseDTO;
import com.example.gamescord.dto.gamemate.SingleGamemateProfileResponseDTO;
import com.example.gamescord.security.CustomUserDetails;
import com.example.gamescord.service.gamemate.GamemateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gamemates")
@RequiredArgsConstructor
public class GamemateController {

    private final GamemateService gamemateService;

    @PostMapping
    public ResponseEntity<GamemateResponseDTO> registerGamemate(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody GamemateRegistrationRequestDTO requestDto) {

        GamemateResponseDTO responseDto = gamemateService.registerGamemate(userDetails.getId(), requestDto);

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @GetMapping("/search")
    public ResponseEntity<List<GamemateResponseDTO>> searchGamemates(@RequestParam String userName) {
        List<GamemateResponseDTO> results = gamemateService.searchGamematesByUserName(userName);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<SingleGamemateProfileResponseDTO> getGamemateProfile(
            @PathVariable Long userId,
            @RequestParam Long gameId) {
        SingleGamemateProfileResponseDTO profile = gamemateService.getSingleGamemateProfile(userId, gameId);
        return ResponseEntity.ok(profile);
    }
}