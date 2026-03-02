package com.haesiku.review.mapper;

import com.haesiku.review.dto.ReviewResponseDto;
import com.haesiku.review.entity.Review;
import com.haesiku.review.entity.ReviewType;
import java.time.LocalDateTime;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-03-02T19:02:15+0900",
    comments = "version: 1.5.5.Final, compiler: IncrementalProcessingEnvironment from gradle-language-java-8.14.3.jar, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class ReviewMapperImpl implements ReviewMapper {

    @Override
    public ReviewResponseDto toResponseDto(Review review) {
        if ( review == null ) {
            return null;
        }

        Long id = null;
        ReviewType reviewType = null;
        String title = null;
        String content = null;
        Integer rating = null;
        String itemTitle = null;
        String itemAuthor = null;
        String itemLink = null;
        LocalDateTime createdAt = null;
        LocalDateTime updatedAt = null;

        id = review.getId();
        reviewType = review.getReviewType();
        title = review.getTitle();
        content = review.getContent();
        rating = review.getRating();
        itemTitle = review.getItemTitle();
        itemAuthor = review.getItemAuthor();
        itemLink = review.getItemLink();
        createdAt = review.getCreatedAt();
        updatedAt = review.getUpdatedAt();

        ReviewResponseDto reviewResponseDto = new ReviewResponseDto( id, reviewType, title, content, rating, itemTitle, itemAuthor, itemLink, createdAt, updatedAt );

        return reviewResponseDto;
    }
}
