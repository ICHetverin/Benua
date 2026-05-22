package com.benua.backend.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.Index;
import org.springframework.stereotype.Component;

@Component
public class IndexInitializer {

    private static final Logger log = LoggerFactory.getLogger(IndexInitializer.class);
    private final MongoTemplate mongoTemplate;

    public IndexInitializer(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void createIndexes() {
        log.info("Creating indexes...");

        mongoTemplate.indexOps("objects").ensureIndex(new Index().on("is_published", Sort.Direction.ASC));
        mongoTemplate.indexOps("objects").ensureIndex(new Index().on("sort_order", Sort.Direction.ASC));

        mongoTemplate.indexOps("persons").ensureIndex(new Index().on("is_published", Sort.Direction.ASC));
        mongoTemplate.indexOps("persons").ensureIndex(new Index().on("sort_order", Sort.Direction.ASC));
        mongoTemplate.indexOps("persons").ensureIndex(new Index().on("profession", Sort.Direction.ASC));

        mongoTemplate.indexOps("excursions").ensureIndex(new Index().on("is_published", Sort.Direction.ASC));
        mongoTemplate.indexOps("excursions").ensureIndex(new Index().on("sort_order", Sort.Direction.ASC));

        log.info("Indexes created.");
    }
}
