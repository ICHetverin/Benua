package com.benua.backend.migration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Component
public class JsonReader {

    private static final Logger log = LoggerFactory.getLogger(JsonReader.class);

    private final ObjectMapper objectMapper;

    public JsonReader(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public <T> List<T> readJson(String path, TypeReference<List<T>> typeRef) {
        try {
            ClassPathResource resource = new ClassPathResource(path);
            try (InputStream is = resource.getInputStream()) {
                return objectMapper.readValue(is, typeRef);
            }
        } catch (IOException e) {
            log.warn("JSON file not found or unreadable: {}. Skipping.", path);
            return List.of();
        }
    }
}
