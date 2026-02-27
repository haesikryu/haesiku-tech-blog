package com.haesiku.blog.mapper;

import com.haesiku.blog.dto.PostResponseDto;
import com.haesiku.blog.entity.Post;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {CategoryMapper.class, TagMapper.class})
public interface PostMapper {

    @Mapping(source = "category", target = "category")
    @Mapping(source = "tags", target = "tags")
    PostResponseDto toResponseDto(Post post);
}
