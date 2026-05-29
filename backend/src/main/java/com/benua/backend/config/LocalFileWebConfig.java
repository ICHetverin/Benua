package com.benua.backend.config;

import com.benua.backend.service.LocalStorageService;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.handler.SimpleUrlHandlerMapping;
import org.springframework.web.servlet.resource.ResourceHttpRequestHandler;

import java.util.List;
import java.util.Map;

/**
 * Serves locally stored files at /files/** via ResourceHttpRequestHandler.
 * Supports HTTP Range requests (206 Partial Content) for audio/video seek/play.
 * Registers explicit MIME types so browsers receive correct Content-Type for .m4a, etc.
 * Active only when LocalStorageService is used (app.s3.enabled=false).
 */
@Configuration
@ConditionalOnBean(LocalStorageService.class)
public class LocalFileWebConfig {

    @Bean
    public SimpleUrlHandlerMapping localFilesHandlerMapping(
            LocalStorageService localStorageService,
            ApplicationContext applicationContext) throws Exception {

        ResourceHttpRequestHandler handler = new ResourceHttpRequestHandler();
        handler.setApplicationContext(applicationContext);
        // file: location must end with /
        handler.setLocationValues(List.of(
                localStorageService.getRootDir().toUri().toString() + "/"
        ));
        // Explicit MIME types — MediaTypeFactory does not include .m4a by default
        handler.setMediaTypes(Map.of(
                "m4a",  MediaType.parseMediaType("audio/mp4"),
                "mp3",  MediaType.parseMediaType("audio/mpeg"),
                "wav",  MediaType.parseMediaType("audio/wav"),
                "ogg",  MediaType.parseMediaType("audio/ogg"),
                "aac",  MediaType.parseMediaType("audio/aac"),
                "jpg",  MediaType.IMAGE_JPEG,
                "jpeg", MediaType.IMAGE_JPEG,
                "png",  MediaType.IMAGE_PNG,
                "webp", MediaType.parseMediaType("image/webp")
        ));
        handler.afterPropertiesSet();

        SimpleUrlHandlerMapping mapping = new SimpleUrlHandlerMapping();
        mapping.setUrlMap(Map.of("/files/**", handler));
        mapping.setOrder(Ordered.LOWEST_PRECEDENCE - 10);
        return mapping;
    }
}
