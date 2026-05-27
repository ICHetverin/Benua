package com.benua.backend.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;
import java.util.List;

/**
 * Запись о захоронении.
 * region: "PETERSBURG" — кладбище Петербурга (cemetery_id → коллекция cemeteries)
 *         "RUSSIA"     — другой город России (city + cemetery_name)
 *         "WORLD"      — зарубежье (city + cemetery_name)
 *         null         — считается "RUSSIA" (обратная совместимость)
 */
@Document(collection = "burials")
public record Burial(
        @Id String _id,
        String region,
        @Field("cemetery_id") String cemeteryId,
        String city,
        @Field("cemetery_name") @Size(max = 255) String cemeteryName,
        @NotBlank @Size(max = 255) String name,
        @Field("life_years") @Size(max = 255) String lifeYears,
        @Field("brief_info") String briefInfo,
        @Field("connected_person_id") String connectedPersonId,
        @DBRef List<Image> images,
        @Field("is_published") Boolean isPublished,
        @Field("sort_order") Integer sortOrder,
        @Field("created_at") Instant createdAt,
        @Field("updated_at") Instant updatedAt,
        @Field("updated_by") String updatedBy
) {}
