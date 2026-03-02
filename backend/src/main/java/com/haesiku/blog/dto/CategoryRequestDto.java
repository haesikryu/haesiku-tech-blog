package com.haesiku.blog.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "카테고리 생성 요청")
public record CategoryRequestDto(
        @Schema(description = "카테고리 이름", example = "Spring Framework", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "카테고리 이름은 필수입니다")
        String name,

        @Schema(description = "카테고리 설명", example = "Spring 관련 기술 포스트")
        String description
) {
}
