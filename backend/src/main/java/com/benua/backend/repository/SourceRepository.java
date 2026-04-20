package com.benua.backend.repository;

import com.benua.backend.model.Source;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SourceRepository extends MongoRepository<Source, String> {}