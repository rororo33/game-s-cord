package com.example.gamescord.dto.gamemate;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GamemateRegistrationRequestDTO {

    @NotNull(message = "게임 ID는 필수입니다.")
    private Long gameId;

    @NotNull(message = "가격은 필수입니다.")
    private Long price;
}