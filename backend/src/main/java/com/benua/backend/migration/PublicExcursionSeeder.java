package com.benua.backend.migration;

import com.benua.backend.model.PublicExcursion;
import com.benua.backend.repository.PublicExcursionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import tools.jackson.core.type.TypeReference;

import java.util.List;

@Component
@Order(3)
public class PublicExcursionSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(PublicExcursionSeeder.class);

    private final PublicExcursionRepository repository;
    private final JsonReader jsonReader;

    public PublicExcursionSeeder(PublicExcursionRepository repository, JsonReader jsonReader) {
        this.repository = repository;
        this.jsonReader = jsonReader;
    }

    @Override
    public void run(String... args) {
        List<PublicExcursion> excursions = jsonReader.readJson(
                "data/public_excursions.json", new TypeReference<>() {});
        for (PublicExcursion exc : excursions) {
            if (repository.existsById(exc._id())) {
                log.info("PublicExcursion already exists, skipping: {}", exc._id());
                continue;
            }
            repository.save(exc);
            log.info("Saved public excursion: {}", exc._id());
        }
    }
}
