package com.haesiku.common.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI openAPI() {
        String securitySchemeName = "bearerAuth";

        return new OpenAPI()
                .info(new Info()
                        .title("Haesiku Tech Blog API")
                        .description("기술 블로그 + 책/강의 후기 통합 REST API. 게시글·카테고리·태그·댓글 CRUD, 후기 CRUD 및 ISBN 조회를 제공합니다.")
                        .version("v1.0.0")
                        .contact(new Contact()
                                .name("Haesiku")
                                .url("https://github.com/haesiku")))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName,
                                new SecurityScheme()
                                        .name(securitySchemeName)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("JWT 인증 토큰을 입력하세요. (추후 구현 예정)")));
    }
}
