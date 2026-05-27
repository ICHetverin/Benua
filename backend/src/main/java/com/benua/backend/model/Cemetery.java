package com.benua.backend.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;
import java.util.List;

/** Петербургское кладбище — самостоятельная сущность с фото и описанием. */
@Document(collection = "cemeteries")
public record Cemetery(
        @Id String _id,
        @NotBlank @Size(max = 255) String name,
        @Field("brief_info") String briefInfo,
        @DBRef List<Image> images,
        @Field("is_published") Boolean isPublished,
        @Field("sort_order") Integer sortOrder,
        @Field("created_at") Instant createdAt,
        @Field("updated_at") Instant updatedAt,
        @Field("updated_by") String updatedBy
) {}
