package com.benua.backend.repository;

import com.benua.backend.model.Infographic;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface InfographicRepository extends MongoRepository<Infographic, String> {}
