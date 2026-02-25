package com.example.gamescord.service.coin;

import com.example.gamescord.domain.Coin;
import com.example.gamescord.domain.User;
import com.example.gamescord.dto.coin.*;
import com.example.gamescord.repository.coin.CoinRepository;
import com.example.gamescord.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.text.NumberFormat;
import java.util.Base64;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
@RequiredArgsConstructor
public class TossPaymentService {

    private final UserRepository userRepository;
    private final CoinRepository coinRepository;
    private final RestTemplate restTemplate;

    @Value("${toss.payments.secret-key}")
    private String secretKey;

    @Value("${toss.payments.api-url}")
    private String tossApiUrl;

    private static final Map<Integer, CoinPackageInfo> COIN_PACKAGES = Map.of(
            1,  new CoinPackageInfo(500,    4680),
            2,  new CoinPackageInfo(1000,   9360),
            3,  new CoinPackageInfo(2000,   18720),
            4,  new CoinPackageInfo(5000,   45600),
            5,  new CoinPackageInfo(10000,  91200),
            6,  new CoinPackageInfo(30000,  266400),
            7,  new CoinPackageInfo(50000,  444000),
            8,  new CoinPackageInfo(100000, 864000),
            9,  new CoinPackageInfo(300000, 2592000),
            10, new CoinPackageInfo(500000, 4320000)
    );

    private final ConcurrentHashMap<String, PendingOrder> pendingOrders = new ConcurrentHashMap<>();

    public TossPaymentOrderResponseDTO createOrder(TossPaymentOrderRequestDTO requestDto, String loginId) {
        CoinPackageInfo pkg = COIN_PACKAGES.get(requestDto.getPackageId());
        if (pkg == null) {
            throw new IllegalArgumentException("존재하지 않는 패키지입니다.");
        }

        String orderId = "GAMESCORD-" + UUID.randomUUID().toString().replace("-", "").substring(0, 16).toUpperCase();
        String orderName = formatCoinAmount(pkg.coinAmount()) + "코인 충전";

        pendingOrders.put(orderId, new PendingOrder(loginId, requestDto.getPackageId(), pkg.paymentAmount(), pkg.coinAmount()));

        log.info("주문 생성 | orderId={} | userId={} | amount={}", orderId, loginId, pkg.paymentAmount());

        return TossPaymentOrderResponseDTO.builder()
                .orderId(orderId)
                .orderName(orderName)
                .amount(pkg.paymentAmount())
                .coinAmount(pkg.coinAmount())
                .build();
    }

    @Transactional
    public CoinResponseDTO confirmPayment(TossPaymentConfirmRequestDTO requestDto, String loginId) {
        PendingOrder pending = pendingOrders.get(requestDto.getOrderId());
        if (pending == null) {
            throw new IllegalArgumentException("유효하지 않거나 이미 처리된 주문입니다.");
        }

        if (!pending.loginId().equals(loginId)) {
            throw new IllegalArgumentException("주문 소유자가 일치하지 않습니다.");
        }

        if (!pending.amount().equals(requestDto.getAmount())) {
            log.warn("금액 위변조 감지 | orderId={} | 기대={} | 전달={}",
                    requestDto.getOrderId(), pending.amount(), requestDto.getAmount());
            throw new IllegalArgumentException("결제 금액이 주문 금액과 일치하지 않습니다.");
        }

        callTossConfirmApi(requestDto.getPaymentKey(), requestDto.getOrderId(), requestDto.getAmount());

        pendingOrders.remove(requestDto.getOrderId());

        User user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        user.setPoint(user.getPoint() + pending.coinAmount());
        userRepository.saveUser(user);

        Coin coin = new Coin();
        coin.setUsers(user);
        coin.setCoinAmount(pending.coinAmount());
        coin.setPaymentAmount(pending.amount());
        coin.setPaymentMethod("토스페이먼츠");
        Coin savedCoin = coinRepository.save(coin);

        log.info("결제 완료 | orderId={} | userId={} | 코인={}", requestDto.getOrderId(), loginId, pending.coinAmount());

        return CoinResponseDTO.success("코인이 성공적으로 충전되었습니다.", savedCoin, user.getPoint());
    }

    private void callTossConfirmApi(String paymentKey, String orderId, Integer amount) {
        String credentials = Base64.getEncoder()
                .encodeToString((secretKey + ":").getBytes(StandardCharsets.UTF_8));

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Basic " + credentials);
        headers.setContentType(MediaType.APPLICATION_JSON);

        try {
            HttpEntity<Void> getRequest = new HttpEntity<>(headers);
            ResponseEntity<Map> getResponse = restTemplate.exchange(
                    tossApiUrl + "/v1/payments/" + paymentKey,
                    HttpMethod.GET,
                    getRequest,
                    Map.class
            );
            if (getResponse.getBody() != null && "DONE".equals(getResponse.getBody().get("status"))) {
                log.info("key-in 결제 완료 확인 | paymentKey={}", paymentKey);
                return;
            }
        } catch (HttpClientErrorException ignored) {
        }


        Map<String, Object> body = Map.of(
                "paymentKey", paymentKey,
                "orderId",    orderId,
                "amount",     amount
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    tossApiUrl + "/v1/payments/confirm",
                    HttpMethod.POST,
                    request,
                    Map.class
            );

            if (response.getStatusCode() != HttpStatus.OK) {
                throw new IllegalStateException("토스 결제 승인 실패: HTTP " + response.getStatusCode());
            }
        } catch (HttpClientErrorException e) {
            String errorBody = e.getResponseBodyAsString();
            log.error("토스 승인 실패 | orderId={} | status={} | body={}", orderId, e.getStatusCode(), errorBody);
            throw new IllegalStateException("결제 승인 중 오류가 발생했습니다: " + parseErrorMessage(errorBody));
        }
    }

    private String parseErrorMessage(String errorBody) {
        if (errorBody != null && errorBody.contains("\"message\"")) {
            try {
                int start = errorBody.indexOf("\"message\"") + 11;
                int end = errorBody.indexOf("\"", start);
                return errorBody.substring(start, end);
            } catch (Exception ignored) {}
        }
        return "알 수 없는 오류";
    }

    private String formatCoinAmount(int amount) {
        return NumberFormat.getNumberInstance(Locale.KOREA).format(amount);
    }

    private record CoinPackageInfo(Integer coinAmount, Integer paymentAmount) {}

    private record PendingOrder(String loginId, Integer packageId, Integer amount, Integer coinAmount) {}
}