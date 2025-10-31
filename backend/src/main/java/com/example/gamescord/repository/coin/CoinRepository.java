package com.example.gamescord.repository.coin;

import com.example.gamescord.domain.Coin;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.example.gamescord.domain.QCoin.coin;

@Repository
@RequiredArgsConstructor
public class CoinRepository {

    private final SDJpaCoinRepository coinRepository;
    private final EntityManager em;
    private final JPAQueryFactory queryFactory;

    public CoinRepository(EntityManager em) {
        this.em = em;
        this.queryFactory = new JPAQueryFactory(em);
    }

    // 코인 충전
    public Coin saveCoin(Coin coinEntity) {
        return coinRepository.save(coinEntity);
    }

    /*// 특정 사용자의 코인 충전 내역 조회 (최신순)
    public List<Coin> findByUsersId(Long usersId) {
        return queryFactory
                .selectFrom(coin)
                .where(coin.users.id.eq(usersId))
                .orderBy(coin.createdAt.desc())
                .fetch();
    }

    // 사용자 코인 잔액 계산
    public Long calculateUserBalance(Long usersId) {
        List<Coin> coins = findByUsersId(usersId);
        return coins.stream()
                .mapToLong(Coin::getCoinAmount)
                .sum();
    }


    // 코인 내역 삭제 (환불 할때)
    public void deleteCoin(Coin coinEntity) {
        coinRepository.delete(coinEntity);
    }*/
}