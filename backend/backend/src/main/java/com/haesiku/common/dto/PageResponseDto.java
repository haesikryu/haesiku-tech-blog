package com.haesiku.common.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.data.domain.Page;

import java.util.List;

@Schema(description = "페이지네이션 응답")
public record PageResponseDto<T>(
        @Schema(description = "데이터 목록")
        List<T> content,

        @Schema(description = "전체 데이터 수", example = "42")
        long totalElements,

        @Schema(description = "전체 페이지 수", example = "5")
        int totalPages,

        @Schema(description = "현재 페이지 (0부터 시작)", example = "0")
        int currentPage,

        @Schema(description = "페이지 크기", example = "10")
        int size
) {
    public static <T> PageResponseDto<T> from(Page<T> page) {
        return new PageResponseDto<>(
                page.getContent(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.getNumber(),
                page.getSize()
        );
    }
}
