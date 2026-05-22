package com.benua.backend.repository;

import com.benua.backend.model.PublicExcursion;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PublicExcursionRepository extends MongoRepository<PublicExcursion, String> {}
