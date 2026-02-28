package com.haesiku.blog.service;

import com.haesiku.blog.dto.PostResponseDto;
import com.haesiku.blog.dto.TagResponseDto;
import com.haesiku.blog.entity.Tag;
import com.haesiku.common.exception.EntityNotFoundException;
import com.haesiku.blog.mapper.PostMapper;
import com.haesiku.blog.mapper.TagMapper;
import com.haesiku.blog.entity.Post;
import com.haesiku.blog.repository.CommentRepository;
import com.haesiku.blog.repository.PostRepository;
import com.haesiku.blog.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TagService {

    private final TagRepository tagRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final TagMapper tagMapper;
    private final PostMapper postMapper;

    @Transactional
    public List<Tag> createOrGetTags(List<String> tagNames) {
        if (tagNames == null || tagNames.isEmpty()) {
            return List.of();
        }

        List<String> distinctNames = tagNames.stream()
                .map(String::trim)
                .filter(name -> !name.isEmpty())
                .distinct()
                .toList();

        List<Tag> existingTags = tagRepository.findByNameIn(distinctNames);

        Map<String, Tag> existingTagMap = existingTags.stream()
                .collect(Collectors.toMap(Tag::getName, Function.identity()));

        List<Tag> newTags = distinctNames.stream()
                .filter(name -> !existingTagMap.containsKey(name))
                .map(name -> Tag.builder().name(name).build())
                .toList();

        if (!newTags.isEmpty()) {
            List<Tag> savedTags = tagRepository.saveAll(newTags);
            existingTags = new ArrayList<>(existingTags);
            existingTags.addAll(savedTags);
        }

        return existingTags;
    }

    public List<TagResponseDto> getAllTags() {
        return tagRepository.findAll().stream()
                .map(tagMapper::toResponseDto)
                .toList();
    }

    public Page<PostResponseDto> getPostsByTag(String slug, Pageable pageable) {
        Tag tag = tagRepository.findBySlug(slug)
                .orElseThrow(() -> new EntityNotFoundException("Tag", "slug", slug));

        Page<Post> page = postRepository.findByTagId(tag.getId(), pageable);
        List<Post> content = page.getContent();
        if (content.isEmpty()) {
            return page.map(post -> postMapper.toResponseDto(post, 0L));
        }
        Map<Long, Long> countMap = commentRepository.countByPostIds(content.stream().map(Post::getId).toList()).stream()
                .collect(Collectors.toMap(row -> (Long) row[0], row -> ((Number) row[1]).longValue()));
        return page.map(post -> postMapper.toResponseDto(post, countMap.getOrDefault(post.getId(), 0L)));
    }
}
