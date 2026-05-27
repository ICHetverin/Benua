package com.benua.backend.repository;

import com.benua.backend.model.Burial;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BurialRepository extends MongoRepository<Burial, String> {
    List<Burial> findByIsPublishedTrue();
}
