package com.benua.backend.controller;

import com.benua.backend.dto.ActivityDto;
import com.benua.backend.service.ActivityService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/activity")
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @GetMapping
    public List<ActivityDto> getRecentActivity(@RequestParam(defaultValue = "20") int limit) {
        return activityService.getRecentActivity(Math.min(limit, 100));
    }
}
