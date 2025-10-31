package com.example.gamescord.dto.coin;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CoinUseRequestDTO {
    @NotNull(message = "사용할 코인 양은 필수입니다")
    @Min(value = 1, message = "최소 1코인 이상 사용해야 합니다")
    private Integer useAmount;
}