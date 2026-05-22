package com.benua.backend.migration;

import com.benua.backend.model.Excursion;
import com.benua.backend.model.PublicExcursion;
import com.benua.backend.repository.ExcursionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import tools.jackson.core.type.TypeReference;

import java.time.Instant;
import java.util.List;

@Component
@Order(4)
public class ExcursionSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(ExcursionSeeder.class);

    private final ExcursionRepository repository;
    private final JsonReader jsonReader;

    public ExcursionSeeder(ExcursionRepository repository, JsonReader jsonReader) {
        this.repository = repository;
        this.jsonReader = jsonReader;
    }

    @Override
    public void run(String... args) {
        List<PublicExcursion> seeds = jsonReader.readJson(
                "data/public_excursions.json", new TypeReference<>() {});
        Instant now = Instant.now();
        for (PublicExcursion src : seeds) {
            if (repository.existsById(src._id())) {
                log.info("Excursion already exists, skipping: {}", src._id());
                continue;
            }
            List<Excursion.ContentSection> textContent = src.textContent() == null ? List.of() :
                    src.textContent().stream()
                            .map(s -> new Excursion.ContentSection(s.topic(), s.content()))
                            .toList();
            List<Excursion.ExcursionSource> sources = src.sources() == null ? List.of() :
                    src.sources().stream()
                            .map(s -> new Excursion.ExcursionSource(s.source(), s.url()))
                            .toList();
            Excursion excursion = new Excursion(
                    src._id(), src.name(), src.description(), src.time(), src.guide(),
                    src.passingMethods(), src.keyPoints(), textContent,
                    src.coverPhoto(), src.routePhoto(), sources,
                    src.isPublished(), src.sortOrder(),
                    now, now, "seeder"
            );
            repository.save(excursion);
            log.info("Seeded excursion: {}", src._id());
        }
    }
}
