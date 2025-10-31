package com.example.gamescord.controller;

import com.example.gamescord.dto.coin.CoinChargeRequestDTO;
import com.example.gamescord.dto.coin.CoinHistoryResponseDTO;
import com.example.gamescord.dto.coin.CoinResponseDTO;
import com.example.gamescord.security.CustomUserDetails;
import com.example.gamescord.service.coin.CoinService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/coins")
@RequiredArgsConstructor
public class CoinController {

    private final CoinService coinService;

    @PostMapping("/charge")
    public ResponseEntity<CoinResponseDTO> chargeCoin(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CoinChargeRequestDTO requestDto) {
        
        String loginId = userDetails.getUsername();
        CoinResponseDTO response = coinService.chargeCoin(loginId, requestDto);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<List<CoinHistoryResponseDTO>> getCoinHistory(
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        String loginId = userDetails.getUsername();
        List<CoinHistoryResponseDTO> history = coinService.getCoinHistory(loginId);

        return ResponseEntity.ok(history);
    }
}
