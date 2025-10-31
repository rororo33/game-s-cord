/*
package com.example.gamescord.dto.review;

import com.example.gamescord.domain.Review;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ReviewResponseDTO {

    private Long reviewId;
    private Integer score;
    private String review;
    private Long gamemateId;

    public static ReviewResponseDTO fromEntity(Review review) {
        return ReviewResponseDTO.builder()
                .reviewId(review.getId())
                .score(review.getScore())
                .review(review.getReview())
                .gamemateId(review.getGamemates().getId())
                .build();
    }
}
*/
