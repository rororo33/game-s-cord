package com.example.gamescord.dto.coin;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CoinChargeRequestDTO {
    // 4680, 9460, .. (원화)
    @NotNull(message = "결제 금액은 필수입니다")
    private Integer paymentAmount;

    // "카드결제", "게좌이체", "간편 결제" 중 하나.
    @NotNull(message = "결제 방법은 필수입니다")
    @Size(max = 45, message = "결제 방법은 45자 이하여야 합니다")
    private String paymentMethod;

    // 500, 1000, ..(코인)
    private Integer coinAmount;

    // 미리 정의된 코인: 금액 map 을 식별하기 위한 ID
    private Integer packageId;
}