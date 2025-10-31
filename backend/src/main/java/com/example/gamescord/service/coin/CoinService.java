package com.example.gamescord.service.coin;

import com.example.gamescord.domain.Coin;
import com.example.gamescord.domain.User;
import com.example.gamescord.dto.coin.CoinChargeRequestDTO;
import com.example.gamescord.dto.coin.CoinHistoryResponseDTO;
import com.example.gamescord.dto.coin.CoinResponseDTO;
import com.example.gamescord.repository.coin.CoinRepository;
import com.example.gamescord.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CoinService {

    private final UserRepository userRepository;
    private final CoinRepository coinRepository;

    // 서버에서 관리하는 코인 패키지 정보 (코인: 원화)
    private static final Map<Integer, CoinPackageInfo> COIN_PACKAGES = Map.of(
            1, new CoinPackageInfo(500, 4680),
            2, new CoinPackageInfo(1000, 9360),
            3, new CoinPackageInfo(2000, 18720),
            4, new CoinPackageInfo(5000, 45600),
            5, new CoinPackageInfo(10000, 91200)
    );

    @Transactional
    public CoinResponseDTO chargeCoin(String loginId, CoinChargeRequestDTO requestDto) {
        // 1. 패키지 정보 조회 및 요청 검증
        CoinPackageInfo packageInfo = COIN_PACKAGES.get(requestDto.getPackageId());

        if (packageInfo == null) {
            throw new IllegalArgumentException("존재하지 않는 패키지입니다.");
        }

        // (Security) 클라이언트가 보낸 금액/코인수와 서버에 저장된 정보가 일치하는지 교차 검증
        if (!packageInfo.coinAmount.equals(requestDto.getCoinAmount()) || !packageInfo.paymentAmount.equals(requestDto.getPaymentAmount())) {
            throw new IllegalArgumentException("요청된 코인 또는 결제 금액이 패키지 정보와 일치하지 않습니다.");
        }

        // 2. 사용자 정보 조회
        User user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 3. 사용자 포인트 업데이트
        user.setPoint(user.getPoint() + packageInfo.coinAmount);
        userRepository.updateUser(user);

        // 4. 거래 내역 기록
        Coin newCoin = new Coin();
        newCoin.setUsers(user);
        newCoin.setCoinAmount(packageInfo.coinAmount);
        newCoin.setPaymentAmount(packageInfo.paymentAmount);
        newCoin.setPaymentMethod(requestDto.getPaymentMethod());
        newCoin.setTransactionType("CHARGE");

        Coin savedCoin = coinRepository.saveCoin(newCoin);

        // 5. 성공 응답 반환
        return CoinResponseDTO.success("코인이 성공적으로 충전되었습니다.", savedCoin, user.getPoint());
    }

    /*// DTO 대신 사용할 내부 record
    private record CoinPackageInfo(Integer coinAmount, Integer paymentAmount) {}

    @Transactional(readOnly = true)
    public List<CoinHistoryResponseDTO> getCoinHistory(String loginId) {
        // 1. 사용자가 존재하는지 확인
        if (!userRepository.existsByLoginId(loginId)) {
            throw new IllegalArgumentException("사용자를 찾을 수 없습니다.");
        }

        // 2. 사용자의 모든 코인 거래 내역을 최신순으로 조회


        // 3. DTO 로 변환하여 반환

    }*/
}