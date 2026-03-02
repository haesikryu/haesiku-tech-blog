package com.haesiku.review.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "ISBN으로 조회한 책 기본 정보")
public record BookInfoDto(
        @Schema(description = "책 제목", example = "클린 코드")
        String title,

        @Schema(description = "저자 (복수일 경우 쉼표 구분)", example = "로버트 C. 마틴")
        String author,

        @Schema(description = "Open Library 상세 URL", example = "https://openlibrary.org/books/...")
        String link
) {
}
