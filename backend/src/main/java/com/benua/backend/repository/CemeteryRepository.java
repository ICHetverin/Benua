package com.benua.backend.repository;

import com.benua.backend.model.Cemetery;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CemeteryRepository extends MongoRepository<Cemetery, String> {
    List<Cemetery> findByIsPublishedTrue();
}
