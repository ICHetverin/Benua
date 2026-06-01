package com.benua.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;
import java.util.List;

@Document(collection = "infographics")
public record Infographic(
        @Id String _id,
        String name,
        String description,
        List<String> authors,
        @Field("connected_persons") List<String> connectedPersons,
        @Field("connected_objects") List<String> connectedObjects,
        @DBRef List<Source> sources,
        @Field("file_url") String fileUrl,
        @Field("file_key") String fileKey,
        @Field("files") List<InfographicFile> files,
        @Field("is_published") Boolean isPublished,
        @Field("sort_order") Integer sortOrder,
        @Field("created_at") Instant createdAt,
        @Field("updated_at") Instant updatedAt,
        @Field("updated_by") String updatedBy
) {}
