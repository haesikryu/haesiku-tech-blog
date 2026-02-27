package com.haesiku.blog.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

@Schema(description = "게시글 생성/수정 요청")
public record PostRequestDto(
        @Schema(description = "게시글 제목", example = "Spring Boot 시작하기", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "제목은 필수입니다")
        @Size(max = 200, message = "제목은 200자 이하여야 합니다")
        String title,

        @Schema(description = "게시글 내용 (Markdown 지원)", example = "# Spring Boot\nSpring Boot는 ...", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "내용은 필수입니다")
        String content,

        @Schema(description = "게시글 요약", example = "Spring Boot 입문 가이드")
        @Size(max = 500, message = "요약은 500자 이하여야 합니다")
        String summary,

        @Schema(description = "작성자", example = "haesiku", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "작성자는 필수입니다")
        String author,

        @Schema(description = "카테고리 ID (null이면 미분류)", example = "1")
        Long categoryId,

        @Schema(description = "태그 이름 목록", example = "[\"Spring\", \"Java\", \"Backend\"]")
        List<String> tagNames
) {
    public PostRequestDto {
        if (tagNames == null) {
            tagNames = List.of();
        }
    }
}
