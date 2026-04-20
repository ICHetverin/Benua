package com.benua.backend.migration;

import com.benua.backend.model.Description;
import com.benua.backend.model.Image;
import com.benua.backend.model.Source;

import java.util.List;

public record BuildingSeedDto(
        String id,
        String name,
        String address,
        Float latitude,
        Float longitude,
        String architect,
        String yearsBuilt,
        String history,
        String design,
        String connectionWithBenua,
        List<Description> description,
        List<String> interestingFacts,
        List<String> connectedPersons,
        List<String> connectedObjects,
        List<Source> sources,
        List<Image> images
) {}
