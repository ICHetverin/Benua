package com.benua.backend.repository;

import com.benua.backend.model.ObjectType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ObjectTypeRepository extends MongoRepository<ObjectType, String> {}
