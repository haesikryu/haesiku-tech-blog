package com.haesiku.blog.service;

import com.haesiku.blog.dto.CommentCreateRequestDto;
import com.haesiku.blog.dto.CommentResponseDto;
import com.haesiku.blog.dto.CommentUpdateRequestDto;
import com.haesiku.blog.entity.Comment;
import com.haesiku.blog.entity.Post;
import com.haesiku.blog.exception.EntityNotFoundException;
import com.haesiku.blog.exception.InvalidPasswordException;
import com.haesiku.blog.repository.CommentRepository;
import com.haesiku.blog.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public CommentResponseDto create(Long postId, CommentCreateRequestDto request) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post", "id", postId));

        String passwordHash = passwordEncoder.encode(request.password());

        Comment comment = Comment.builder()
                .author(request.author())
                .passwordHash(passwordHash)
                .body(request.body())
                .post(post)
                .build();

        Comment saved = commentRepository.save(comment);
        return toResponseDto(saved);
    }

    public List<CommentResponseDto> findByPostId(Long postId) {
        if (!postRepository.existsById(postId)) {
            throw new EntityNotFoundException("Post", "id", postId);
        }
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId).stream()
                .map(this::toResponseDto)
                .toList();
    }

    @Transactional
    public CommentResponseDto update(Long postId, Long commentId, CommentUpdateRequestDto request) {
        Comment comment = findCommentByPostAndId(postId, commentId);
        if (!passwordEncoder.matches(request.password(), comment.getPasswordHash())) {
            throw new InvalidPasswordException("비밀번호가 일치하지 않습니다.");
        }
        comment.updateBody(request.body());
        return toResponseDto(comment);
    }

    @Transactional
    public void delete(Long postId, Long commentId, String password) {
        Comment comment = findCommentByPostAndId(postId, commentId);
        if (!passwordEncoder.matches(password, comment.getPasswordHash())) {
            throw new InvalidPasswordException("비밀번호가 일치하지 않습니다.");
        }
        commentRepository.delete(comment);
    }

    private Comment findCommentByPostAndId(Long postId, Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment", "id", commentId));
        if (!comment.getPost().getId().equals(postId)) {
            throw new EntityNotFoundException("Comment", "id", commentId);
        }
        return comment;
    }

    private CommentResponseDto toResponseDto(Comment c) {
        return new CommentResponseDto(
                c.getId(),
                c.getAuthor(),
                c.getBody(),
                c.getCreatedAt(),
                c.getUpdatedAt()
        );
    }
}
