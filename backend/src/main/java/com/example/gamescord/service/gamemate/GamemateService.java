package com.example.gamescord.service.gamemate;

import com.example.gamescord.domain.Game;
import com.example.gamescord.domain.Gamemate;
import com.example.gamescord.domain.User;
import com.example.gamescord.dto.gamemate.GamemateRegistrationRequestDTO;
import com.example.gamescord.dto.gamemate.GamemateResponseDTO;
import com.example.gamescord.dto.gamemate.SingleGamemateProfileResponseDTO;
import com.example.gamescord.repository.user.UserRepository;
import com.example.gamescord.repository.game.GameRepository;
import com.example.gamescord.repository.gamemate.GameMateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GamemateService {

    private final UserRepository userRepository;
    private final GameRepository gameRepository;
    private final GameMateRepository gameMateRepository;

    @Transactional
    public GamemateResponseDTO registerGamemate(Long userId, GamemateRegistrationRequestDTO requestDto) {
        User user = userRepository.findById(userId);

        Game game = gameRepository.findGameById(requestDto.getGameId());
        if (game == null) {
            throw new IllegalArgumentException("게임을 찾을 수 없습니다.");
        }

        if (gameMateRepository.findGamemateByUsersId(userId, requestDto.getGameId()) != null) {
            throw new IllegalArgumentException("이미 해당 게임의 게임메이트로 등록되어 있습니다.");
        }

        Gamemate newGamemate = new Gamemate();
        newGamemate.setUsers(user);
        newGamemate.setGames(game);
        newGamemate.setPrice(requestDto.getPrice());

        gameMateRepository.saveGamemate(newGamemate);

        return GamemateResponseDTO.fromEntity(newGamemate);
    }

    @Transactional(readOnly = true)
    public List<GamemateResponseDTO> searchGamematesByUserName(String userName) {
        List<Gamemate> gamemates = gameMateRepository.findGamematesByUsersName(userName);
        return gamemates.stream()
                .map(GamemateResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SingleGamemateProfileResponseDTO getSingleGamemateProfile(Long userId, Long gameId) {
        User user = userRepository.findById(userId);

        Gamemate gamemate = gameMateRepository.findGamemateByUsersId(userId, gameId);
        if (gamemate == null) {
            throw new IllegalArgumentException("해당 사용자는 이 게임의 게임메이트로 등록되어 있지 않습니다.");
        }

        return SingleGamemateProfileResponseDTO.from(user, gamemate);
    }
}