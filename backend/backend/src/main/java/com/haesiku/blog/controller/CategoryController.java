package com.haesiku.blog.controller;

import com.haesiku.blog.dto.CategoryRequestDto;
import com.haesiku.blog.dto.CategoryResponseDto;
import com.haesiku.common.dto.ErrorResponseDto;
import com.haesiku.common.dto.PageResponseDto;
import com.haesiku.blog.dto.PostResponseDto;
import com.haesiku.blog.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Categories", description = "카테고리 API")
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @Operation(summary = "카테고리 생성", description = "새 카테고리를 생성합니다. slug는 이름 기반으로 자동 생성됩니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "카테고리 생성 성공",
                    content = @Content(schema = @Schema(implementation = CategoryResponseDto.class))),
            @ApiResponse(responseCode = "400", description = "입력값 검증 실패",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
    })
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "카테고리 생성 요청",
            required = true,
            content = @Content(examples = @ExampleObject(value = """
                    {
                      "name": "Spring Framework",
                      "description": "Spring 관련 기술 포스트"
                    }
                    """)))
    @PostMapping
    public ResponseEntity<CategoryResponseDto> createCategory(
            @Valid @RequestBody CategoryRequestDto request) {
        CategoryResponseDto response = categoryService.createCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Operation(summary = "전체 카테고리 조회", description = "등록된 모든 카테고리를 조회합니다.")
    @ApiResponse(responseCode = "200", description = "카테고리 목록 조회 성공")
    @GetMapping
    public ResponseEntity<List<CategoryResponseDto>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @Operation(summary = "카테고리별 게시글 조회", description = "특정 카테고리에 속한 발행된 게시글을 페이지 단위로 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "게시글 목록 조회 성공"),
            @ApiResponse(responseCode = "404", description = "카테고리를 찾을 수 없음",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDto.class)))
    })
    @GetMapping("/{slug}/posts")
    public ResponseEntity<PageResponseDto<PostResponseDto>> getPostsByCategory(
            @Parameter(description = "카테고리 slug", example = "spring-framework") @PathVariable String slug,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC)
            Pageable pageable) {
        return ResponseEntity.ok(PageResponseDto.from(categoryService.getPostsByCategory(slug, pageable)));
    }
}
