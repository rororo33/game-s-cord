package com.example.gamescord.dto.gamemate;

import com.example.gamescord.domain.Gamemate;
import com.example.gamescord.domain.User;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SingleGamemateProfileResponseDTO {
    private Long userId;
    private String userName;
    private String userDescription;
    private String profileImageUrl;

    private Long gamemateId;
    private Long gameId;
    private String gameName;
    private Long price;

    public static SingleGamemateProfileResponseDTO from(User user, Gamemate gamemate) {
        return SingleGamemateProfileResponseDTO.builder()
                .userId(user.getId())
                .userName(user.getUsersName())
                .userDescription(user.getUsersDescription())
                .profileImageUrl(user.getProfileImageUrl())
                .gamemateId(gamemate.getId())
                .gameId(gamemate.getGames().getId())
                .gameName(gamemate.getGames().getGamesName())
                .price(gamemate.getPrice())
                .build();
    }
}