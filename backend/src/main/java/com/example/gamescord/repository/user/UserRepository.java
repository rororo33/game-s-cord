package com.example.gamescord.repository.user;

import com.example.gamescord.domain.User;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import static com.example.gamescord.domain.QUser.user;

@Repository
@RequiredArgsConstructor
public class UserRepository {

    private final SDJpaUserRepository userRepository;
    private final EntityManager em;
    private final JPAQueryFactory queryFactory;

    public UserRepository(EntityManager em) {
        this.em = em;
        this.queryFactory = new JPAQueryFactory(em);
    }

    // 회원가입
    public void saveUser(User userEntity) {
        userRepository.save(userEntity);
    }

    public Optional<User> findByLoginId(String loginId) {
        User foundUser = queryFactory
                .selectFrom(user)
                .where(user.loginId.eq(loginId))
                .fetchOne();
        return Optional.ofNullable(foundUser);
    }

    // 중복 체크
    public boolean existsByLoginId(String loginId) {
        Integer count = queryFactory
                .selectOne()
                .from(user)
                .where(user.loginId.eq(loginId))
                .fetchFirst();
        return count != null;
    }

    public User findById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
    }

    // 로그인 실패했을때 횟수 증가
    public void incrementLoginFailCount(User userEntity) {
        userEntity.setLoginFailCount(userEntity.getLoginFailCount() + 1);
        userRepository.save(userEntity);
    }

    // 로그인 성공하면 실패 횟수 초기화
    public void resetLoginFailCount(User userEntity) {
        userEntity.setLoginFailCount(0);
        userRepository.save(userEntity);
    }

    public void updateUser(User userEntity) {
        userRepository.save(userEntity);
    }
}