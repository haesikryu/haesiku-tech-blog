package com.haesiku.review.dto;

import com.haesiku.review.entity.ReviewType;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(description = "후기 응답")
public record ReviewResponseDto(
        @Schema(description = "후기 ID", example = "1")
        Long id,

        @Schema(description = "후기 유형", example = "BOOK")
        ReviewType reviewType,

        @Schema(description = "후기 제목", example = "실무에 바로 쓸 수 있는 책")
        String title,

        @Schema(description = "후기 내용 (Markdown)", example = "# 인상 깊었던 점\n...")
        String content,

        @Schema(description = "평점 (1~5)", example = "5")
        Integer rating,

        @Schema(description = "책/강의 제목", example = "클린 코드")
        String itemTitle,

        @Schema(description = "저자/강사", example = "로버트 C. 마틴")
        String itemAuthor,

        @Schema(description = "구매/강의 링크", example = "https://...")
        String itemLink,

        @Schema(description = "생성일시", example = "2025-01-15T10:30:00")
        LocalDateTime createdAt,

        @Schema(description = "수정일시", example = "2025-01-16T14:20:00")
        LocalDateTime updatedAt
) {
}
