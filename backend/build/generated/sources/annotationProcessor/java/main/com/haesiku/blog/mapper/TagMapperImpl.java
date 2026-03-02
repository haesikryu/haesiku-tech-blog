package com.haesiku.blog.mapper;

import com.haesiku.blog.dto.TagResponseDto;
import com.haesiku.blog.entity.Tag;
import java.time.LocalDateTime;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-03-02T19:02:15+0900",
    comments = "version: 1.5.5.Final, compiler: IncrementalProcessingEnvironment from gradle-language-java-8.14.3.jar, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class TagMapperImpl implements TagMapper {

    @Override
    public TagResponseDto toResponseDto(Tag tag) {
        if ( tag == null ) {
            return null;
        }

        Long id = null;
        String name = null;
        String slug = null;
        LocalDateTime createdAt = null;

        id = tag.getId();
        name = tag.getName();
        slug = tag.getSlug();
        createdAt = tag.getCreatedAt();

        TagResponseDto tagResponseDto = new TagResponseDto( id, name, slug, createdAt );

        return tagResponseDto;
    }
}
