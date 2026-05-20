package com.benua.backend.migration;

import java.util.List;

public record ObjectTypeSeedDto(
        String id,
        String name,
        List<String> subtypes
) {}
