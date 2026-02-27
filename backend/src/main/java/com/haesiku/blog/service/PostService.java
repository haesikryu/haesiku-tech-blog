package com.haesiku.blog.service;

import com.haesiku.blog.dto.PostRequestDto;
import com.haesiku.blog.dto.PostResponseDto;
import com.haesiku.blog.entity.Category;
import com.haesiku.blog.entity.Post;
import com.haesiku.blog.entity.PostStatus;
import com.haesiku.blog.entity.Tag;
import com.haesiku.blog.exception.EntityNotFoundException;
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
public class PostService {

    private final PostRepository postRepository;
    private final CategoryRepository categoryRepository;
    private final TagService tagService;
    private final PostMapper postMapper;

    @Transactional
    public PostResponseDto createPost(PostRequestDto request) {
        Category category = resolveCategory(request.categoryId());

        Post post = Post.builder()
                .title(request.title())
                .content(request.content())
                .summary(request.summary())
                .author(request.author())
                .category(category)
                .build();

        applyTags(post, request.tagNames());

        return postMapper.toResponseDto(postRepository.save(post));
    }

    @Transactional
    public PostResponseDto updatePost(Long id, PostRequestDto request) {
        Post post = findPostById(id);
        Category category = resolveCategory(request.categoryId());

        post.update(request.title(), request.content(), request.summary(), category);

        post.clearTags();
        applyTags(post, request.tagNames());

        return postMapper.toResponseDto(post);
    }

    @Transactional
    public void deletePost(Long id) {
        Post post = findPostById(id);
        postRepository.delete(post);
    }

    @Transactional
    public PostResponseDto getPost(String slug) {
        Post post = postRepository.findBySlug(slug)
                .orElseThrow(() -> new EntityNotFoundException("Post", "slug", slug));

        post.incrementViewCount();

        return postMapper.toResponseDto(post);
    }

    public PostResponseDto getPostById(Long id) {
        Post post = findPostById(id);
        return postMapper.toResponseDto(post);
    }

    public Page<PostResponseDto> getAllPosts(Pageable pageable) {
        return postRepository.findAll(pageable)
                .map(postMapper::toResponseDto);
    }

    public Page<PostResponseDto> getPublishedPosts(Pageable pageable) {
        return postRepository.findByStatusOrderByCreatedAtDesc(PostStatus.PUBLISHED, pageable)
                .map(postMapper::toResponseDto);
    }

    public Page<PostResponseDto> searchPosts(String keyword, Pageable pageable) {
        return postRepository.findByTitleContainingOrderByCreatedAtDesc(keyword, pageable)
                .map(postMapper::toResponseDto);
    }

    @Transactional
    public PostResponseDto publishPost(Long id) {
        Post post = findPostById(id);
        post.publish();
        return postMapper.toResponseDto(post);
    }

    private Post findPostById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Post", "id", id));
    }

    private Category resolveCategory(Long categoryId) {
        if (categoryId == null) {
            return null;
        }
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new EntityNotFoundException("Category", "id", categoryId));
    }

    private void applyTags(Post post, List<String> tagNames) {
        if (tagNames == null || tagNames.isEmpty()) {
            return;
        }
        List<Tag> tags = tagService.createOrGetTags(tagNames);
        tags.forEach(post::addTag);
    }
}
