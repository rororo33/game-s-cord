package com.example.gamescord.config;

import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

// todo: QueryDSL 을 사용하기 위한 필수 설정.(조웅)
// spring boot 에게 JPAQueryFactory 를 만들어서 사용하라고 알리기 위함.
// 없을 시 오류 발생.
@Configuration
public class QueryDslConfig {

    @PersistenceContext
    private EntityManager entityManager;

    @Bean
    public JPAQueryFactory jpaQueryFactory() {
        return new JPAQueryFactory(entityManager);
    }
}
