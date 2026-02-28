package com.haesiku.blog.service;

import com.haesiku.blog.dto.PostRequestDto;
import com.haesiku.blog.dto.PostResponseDto;
import com.haesiku.blog.entity.Category;
import com.haesiku.blog.entity.Post;
import com.haesiku.blog.entity.PostStatus;
import com.haesiku.blog.entity.Tag;
import com.haesiku.common.exception.EntityNotFoundException;
import com.haesiku.blog.mapper.PostMapper;
import com.haesiku.blog.repository.CategoryRepository;
import com.haesiku.blog.repository.CommentRepository;
import com.haesiku.blog.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostService {

    private final PostRepository postRepository;
    private final CategoryRepository categoryRepository;
    private final CommentRepository commentRepository;
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

        Post saved = postRepository.save(post);
        return postMapper.toResponseDto(saved, 0L);
    }

    @Transactional
    public PostResponseDto updatePost(Long id, PostRequestDto request) {
        Post post = findPostById(id);
        Category category = resolveCategory(request.categoryId());

        post.update(request.title(), request.content(), request.summary(), category);

        post.clearTags();
        applyTags(post, request.tagNames());

        long commentCount = commentRepository.countByPostId(post.getId());
        return postMapper.toResponseDto(post, commentCount);
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

        long commentCount = commentRepository.countByPostId(post.getId());
        return postMapper.toResponseDto(post, commentCount);
    }

    public PostResponseDto getPostById(Long id) {
        Post post = findPostById(id);
        long commentCount = commentRepository.countByPostId(post.getId());
        return postMapper.toResponseDto(post, commentCount);
    }

    public Page<PostResponseDto> getAllPosts(Pageable pageable) {
        Page<Post> page = postRepository.findAll(pageable);
        Map<Long, Long> countMap = getCommentCountMap(page.getContent());
        return page.map(post -> postMapper.toResponseDto(post, countMap.getOrDefault(post.getId(), 0L)));
    }

    public Page<PostResponseDto> getPublishedPosts(Pageable pageable) {
        Page<Post> page = postRepository.findByStatusOrderByCreatedAtDesc(PostStatus.PUBLISHED, pageable);
        Map<Long, Long> countMap = getCommentCountMap(page.getContent());
        return page.map(post -> postMapper.toResponseDto(post, countMap.getOrDefault(post.getId(), 0L)));
    }

    public Page<PostResponseDto> searchPosts(String keyword, Pageable pageable) {
        Page<Post> page = postRepository.findByTitleContainingOrderByCreatedAtDesc(keyword, pageable);
        Map<Long, Long> countMap = getCommentCountMap(page.getContent());
        return page.map(post -> postMapper.toResponseDto(post, countMap.getOrDefault(post.getId(), 0L)));
    }

    @Transactional
    public PostResponseDto publishPost(Long id) {
        Post post = findPostById(id);
        post.publish();
        long commentCount = commentRepository.countByPostId(post.getId());
        return postMapper.toResponseDto(post, commentCount);
    }

    private Map<Long, Long> getCommentCountMap(List<Post> posts) {
        if (posts.isEmpty()) {
            return Map.of();
        }
        List<Long> postIds = posts.stream().map(Post::getId).toList();
        List<Object[]> rows = commentRepository.countByPostIds(postIds);
        return rows.stream()
                .collect(Collectors.toMap(row -> (Long) row[0], row -> ((Number) row[1]).longValue()));
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
