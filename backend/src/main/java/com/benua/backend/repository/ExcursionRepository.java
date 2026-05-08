package com.benua.backend.repository;

import com.benua.backend.model.Excursion;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ExcursionRepository extends MongoRepository<Excursion, String> {
}
