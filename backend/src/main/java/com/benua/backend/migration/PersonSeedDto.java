package com.benua.backend.migration;

import com.benua.backend.model.Description;
import com.benua.backend.model.Image;
import com.benua.backend.model.Source;

import java.util.List;

public record PersonSeedDto(
        String id,
        String name,
        String lifeYears,
        String birthPlace,
        String profession,
        String connectionWithBenua,
        List<Description> description,
        List<String> interestingFacts,
        List<String> connectedPersons,
        List<String> connectedObjects,
        List<Image> images,
        List<Source> sources
) {}
