package com.haesiku.blog.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "댓글 작성 요청")
public record CommentCreateRequestDto(
        @Schema(description = "작성자", example = "방문자", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "작성자를 입력해 주세요.")
        @Size(max = 100)
        String author,

        @Schema(description = "수정/삭제 시 사용할 비밀번호", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "비밀번호를 입력해 주세요.")
        @Size(min = 4, max = 100, message = "비밀번호는 4자 이상 100자 이하여야 합니다.")
        String password,

        @Schema(description = "댓글 내용", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "댓글 내용을 입력해 주세요.")
        @Size(max = 2000, message = "댓글은 2000자 이하여야 합니다.")
        String body
) {
}
