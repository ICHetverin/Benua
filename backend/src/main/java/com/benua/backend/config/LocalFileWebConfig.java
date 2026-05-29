package com.benua.backend.config;

import com.benua.backend.service.LocalStorageService;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Serves locally stored files at /files/** using Spring's ResourceHttpRequestHandler,
 * which supports HTTP Range requests (206 Partial Content) needed for audio/video playback.
 * Active only when LocalStorageService is used (app.s3.enabled=false).
 */
@Configuration
@ConditionalOnBean(LocalStorageService.class)
public class LocalFileWebConfig implements WebMvcConfigurer {

    private final LocalStorageService localStorageService;

    public LocalFileWebConfig(LocalStorageService localStorageService) {
        this.localStorageService = localStorageService;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String location = "file:" + localStorageService.getRootDir().toString() + "/";
        registry.addResourceHandler("/files/**")
                .addResourceLocations(location)
                .setCacheControl(CacheControl.noCache());
    }
}
