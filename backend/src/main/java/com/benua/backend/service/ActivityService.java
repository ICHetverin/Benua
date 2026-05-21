package com.benua.backend.service;

import com.benua.backend.dto.ActivityDto;
import com.benua.backend.model.Building;
import com.benua.backend.model.Excursion;
import com.benua.backend.model.Person;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class ActivityService {

    private final MongoTemplate mongoTemplate;

    public ActivityService(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public List<ActivityDto> getRecentActivity(int limit) {
        int fetchPerCollection = limit * 2;
        Query q = new Query()
                .with(Sort.by(Sort.Direction.DESC, "updated_at"))
                .limit(fetchPerCollection);

        List<ActivityDto> items = new ArrayList<>();

        mongoTemplate.find(q, Person.class).forEach(p ->
                items.add(new ActivityDto(p._id(), p.name(), "person", p.updatedAt(), p.updatedBy())));

        mongoTemplate.find(q, Building.class).forEach(b ->
                items.add(new ActivityDto(b._id(), b.name(), "building", b.updatedAt(), b.updatedBy())));

        mongoTemplate.find(q, Excursion.class).forEach(e ->
                items.add(new ActivityDto(e._id(), e.title(), "excursion", e.updatedAt(), e.updatedBy())));

        return items.stream()
                .filter(a -> a.updatedAt() != null)
                .sorted(Comparator.comparing(ActivityDto::updatedAt).reversed())
                .limit(limit)
                .toList();
    }
}
