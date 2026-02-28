package com.haesiku.review.dto;

import com.haesiku.review.entity.ReviewType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Schema(description = "후기 생성/수정 요청")
public record ReviewRequestDto(
        @Schema(description = "후기 유형 (BOOK | COURSE)", example = "BOOK", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotNull(message = "후기 유형은 필수입니다")
        ReviewType reviewType,

        @Schema(description = "후기 제목", example = "실무에 바로 쓸 수 있는 책", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "후기 제목은 필수입니다")
        @Size(max = 200, message = "제목은 200자 이하여야 합니다")
        String title,

        @Schema(description = "후기 내용 (Markdown 지원)", example = "# 인상 깊었던 점\n...", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "후기 내용은 필수입니다")
        String content,

        @Schema(description = "평점 (1~5)", example = "5", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotNull(message = "평점은 필수입니다")
        @Min(value = 1, message = "평점은 1 이상이어야 합니다")
        @Max(value = 5, message = "평점은 5 이하여야 합니다")
        Integer rating,

        @Schema(description = "책/강의 제목", example = "클린 코드", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "책/강의 제목은 필수입니다")
        @Size(max = 300, message = "책/강의 제목은 300자 이하여야 합니다")
        String itemTitle,

        @Schema(description = "저자/강사", example = "로버트 C. 마틴")
        @Size(max = 200, message = "저자/강사는 200자 이하여야 합니다")
        String itemAuthor,

        @Schema(description = "구매/강의 링크", example = "https://...")
        @Size(max = 500, message = "링크는 500자 이하여야 합니다")
        String itemLink
) {
}
