package com.benua.backend.migration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.BulkOperations;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;

@Component
@Order(2)
public class MigrationStep04AdminFields implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(MigrationStep04AdminFields.class);
    private final MongoTemplate mongoTemplate;

    public MigrationStep04AdminFields(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public void run(String... args) {
        log.info("Migration step 04: applying admin fields...");
        applyAdminFields("objects");
        applyAdminFields("persons");
        applySortOrder("objects");
        applySortOrder("persons");
        log.info("Migration step 04: done.");
    }

    private void applyAdminFields(String collection) {
        Instant now = Instant.now();
        long updated = mongoTemplate.updateMulti(
                new Query(Criteria.where("is_published").exists(false)),
                new Update()
                        .set("is_published", true)
                        .set("created_at", now)
                        .set("updated_at", now),
                collection
        ).getModifiedCount();
        if (updated > 0) {
            log.info("Set is_published=true on {} documents in '{}'", updated, collection);
        }
    }

    private void applySortOrder(String collection) {
        Query query = new Query(Criteria.where("sort_order").exists(false))
                .with(Sort.by(Sort.Direction.ASC, "_id"));
        List<?> docs = mongoTemplate.find(query, org.bson.Document.class, collection);
        if (docs.isEmpty()) return;

        BulkOperations bulk = mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, collection);
        for (int i = 0; i < docs.size(); i++) {
            org.bson.Document doc = (org.bson.Document) docs.get(i);
            bulk.updateOne(
                    new Query(Criteria.where("_id").is(doc.get("_id"))),
                    new Update().set("sort_order", i)
            );
        }
        bulk.execute();
        log.info("Set sort_order on {} documents in '{}'", docs.size(), collection);
    }
}
