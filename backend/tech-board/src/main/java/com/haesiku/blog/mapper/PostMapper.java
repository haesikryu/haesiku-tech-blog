package com.haesiku.blog.mapper;

import com.haesiku.blog.dto.PostResponseDto;
import com.haesiku.blog.entity.Post;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {CategoryMapper.class, TagMapper.class})
public interface PostMapper {

    @Mapping(source = "post.category", target = "category")
    @Mapping(source = "post.tags", target = "tags")
    @Mapping(target = "commentCount", expression = "java(commentCount)")
    PostResponseDto toResponseDto(Post post, long commentCount);
}
