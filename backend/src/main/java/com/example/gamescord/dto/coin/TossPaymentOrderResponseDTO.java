package com.example.gamescord.dto.coin;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TossPaymentOrderResponseDTO {
    private final String orderId;
    private final String orderName;
    private final Integer amount;
    private final Integer coinAmount;
}