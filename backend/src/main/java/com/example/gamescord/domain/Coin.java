package com.example.gamescord.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "coin")
public class Coin {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "coin_id", nullable = false)
  private Long id;

  @NotNull
  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "users_id", nullable = false)
  private User users;

  @NotNull
  @Column(name = "coin_amount", nullable = false)
  private Integer coinAmount;

  @NotNull
  @Column(name = "payment_amount", nullable = false)
  private Integer paymentAmount;

  @Size(max = 45)
  @NotNull
  @Column(name = "payment_method", nullable = false, length = 45)
  private String paymentMethod;

  // todo: 거래 유형 필드 추가함.
  @Size(max = 45)
  @Column(name = "transaction_type", length = 45)
  private String transactionType;

  @NotNull
  @Column(name = "created_at", nullable = false)

  @CreationTimestamp
  private Instant createdAt;

}