package com.haesiku.blog.mapper;

import com.haesiku.blog.dto.CategoryResponseDto;
import com.haesiku.blog.dto.PostResponseDto;
import com.haesiku.blog.dto.TagResponseDto;
import com.haesiku.blog.entity.Post;
import com.haesiku.blog.entity.PostStatus;
import com.haesiku.blog.entity.Tag;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-03-02T19:02:15+0900",
    comments = "version: 1.5.5.Final, compiler: IncrementalProcessingEnvironment from gradle-language-java-8.14.3.jar, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class PostMapperImpl implements PostMapper {

    @Autowired
    private CategoryMapper categoryMapper;
    @Autowired
    private TagMapper tagMapper;

    @Override
    public PostResponseDto toResponseDto(Post post, long commentCount) {
        if ( post == null ) {
            return null;
        }

        CategoryResponseDto category = null;
        List<TagResponseDto> tags = null;
        Long id = null;
        String title = null;
        String content = null;
        String summary = null;
        String author = null;
        String slug = null;
        PostStatus status = null;
        Long viewCount = null;
        LocalDateTime createdAt = null;
        LocalDateTime updatedAt = null;
        LocalDateTime publishedAt = null;
        if ( post != null ) {
            category = categoryMapper.toResponseDto( post.getCategory() );
            tags = tagSetToTagResponseDtoList( post.getTags() );
            id = post.getId();
            title = post.getTitle();
            content = post.getContent();
            summary = post.getSummary();
            author = post.getAuthor();
            slug = post.getSlug();
            status = post.getStatus();
            viewCount = post.getViewCount();
            createdAt = post.getCreatedAt();
            updatedAt = post.getUpdatedAt();
            publishedAt = post.getPublishedAt();
        }

        Long commentCount1 = commentCount;

        PostResponseDto postResponseDto = new PostResponseDto( id, title, content, summary, author, slug, status, viewCount, commentCount1, category, tags, createdAt, updatedAt, publishedAt );

        return postResponseDto;
    }

    protected List<TagResponseDto> tagSetToTagResponseDtoList(Set<Tag> set) {
        if ( set == null ) {
            return null;
        }

        List<TagResponseDto> list = new ArrayList<TagResponseDto>( set.size() );
        for ( Tag tag : set ) {
            list.add( tagMapper.toResponseDto( tag ) );
        }

        return list;
    }
}
