package com.example.gamescord.repository.coin;

import com.example.gamescord.domain.Coin;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import static com.example.gamescord.domain.QCoin.coin;

@Repository
@RequiredArgsConstructor
public class CoinRepository {

    @Autowired
    private final SDJpaCoinRepository coinRepository;
    private final EntityManager em;
    private final JPAQueryFactory queryFactory;

    public Coin save(Coin coinEntity) {
        return coinRepository.save(coinEntity);
    }

    public Optional<Coin> findById(Long coinId) {
        return coinRepository.findById(coinId);
    }

    public List<Coin> findByUserLoginId(String loginId) {
        return queryFactory
                .selectFrom(coin)
                .where(coin.users.loginId.eq(loginId))
                .orderBy(coin.createdAt.desc())
                .fetch();
    }

    public void delete(Coin coinEntity) {
        coinRepository.delete(coinEntity);
    }
}
