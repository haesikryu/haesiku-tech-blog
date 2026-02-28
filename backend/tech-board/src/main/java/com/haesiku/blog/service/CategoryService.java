package com.haesiku.blog.service;

import com.haesiku.blog.dto.CategoryRequestDto;
import com.haesiku.blog.dto.CategoryResponseDto;
import com.haesiku.blog.dto.PostResponseDto;
import com.haesiku.blog.entity.Category;
import com.haesiku.blog.exception.EntityNotFoundException;
import com.haesiku.blog.mapper.CategoryMapper;
import com.haesiku.blog.mapper.PostMapper;
import com.haesiku.blog.repository.CategoryRepository;
import com.haesiku.blog.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final PostRepository postRepository;
    private final CategoryMapper categoryMapper;
    private final PostMapper postMapper;

    @Transactional
    public CategoryResponseDto createCategory(CategoryRequestDto request) {
        if (categoryRepository.existsByName(request.name())) {
            throw new IllegalArgumentException("이미 존재하는 카테고리입니다: " + request.name());
        }

        Category category = Category.builder()
                .name(request.name())
                .description(request.description())
                .build();

        return categoryMapper.toResponseDto(categoryRepository.save(category));
    }

    public List<CategoryResponseDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(categoryMapper::toResponseDto)
                .toList();
    }

    public Page<PostResponseDto> getPostsByCategory(String slug, Pageable pageable) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new EntityNotFoundException("Category", "slug", slug));

        return postRepository.findByCategoryIdOrderByCreatedAtDesc(category.getId(), pageable)
                .map(postMapper::toResponseDto);
    }
}
