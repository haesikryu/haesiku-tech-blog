package com.haesiku.blog.controller;

import com.haesiku.blog.dto.ErrorResponseDto;
import com.haesiku.blog.dto.PageResponseDto;
import com.haesiku.blog.dto.PostResponseDto;
import com.haesiku.blog.dto.TagResponseDto;
import com.haesiku.blog.service.TagService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Tags", description = "태그 API")
@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    @Operation(summary = "전체 태그 조회", description = "등록된 모든 태그를 조회합니다.")
    @ApiResponse(responseCode = "200", description = "태그 목록 조회 성공")
    @GetMapping
    public ResponseEntity<List<TagResponseDto>> getAllTags() {
        return ResponseEntity.ok(tagService.getAllTags());
    }

    @Operation(summary = "태그별 게시글 조회", description = "특정 태그가 포함된 발행된 게시글을 페이지 단위로 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "게시글 목록 조회 성공"),
            @ApiResponse(responseCode = "404", description = "태그를 찾을 수 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
    })
    @GetMapping("/{slug}/posts")
    public ResponseEntity<PageResponseDto<PostResponseDto>> getPostsByTag(
            @Parameter(description = "태그 slug", example = "java") @PathVariable String slug,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC)
            Pageable pageable) {
        return ResponseEntity.ok(PageResponseDto.from(tagService.getPostsByTag(slug, pageable)));
    }
}
