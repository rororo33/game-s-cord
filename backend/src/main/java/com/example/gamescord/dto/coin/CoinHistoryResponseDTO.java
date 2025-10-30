package com.example.gamescord.dto.coin;

import com.example.gamescord.domain.Coin;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;


@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CoinHistoryResponseDTO {
    private Long coinId;
    private Integer coinAmount;
    private Integer paymentAmount;
    private String paymentMethod;
    private Instant createdAt;
    private String transactionType;
    private String refundReason;
    private String eventType;

    public static CoinHistoryResponseDTO fromEntity(Coin coin) {
        return CoinHistoryResponseDTO.builder()
                .coinId(coin.getId())
                .coinAmount(coin.getCoinAmount())
                .paymentAmount(coin.getPaymentAmount())
                .paymentMethod(coin.getPaymentMethod())
                .createdAt(coin.getCreatedAt())
                .transactionType(coin.getTransactionType())
                .refundReason(coin.getRefundReason())
                .eventType(coin.getEventType())
                .build();
    }
}