package com.bezkoder.springjwt.controllers;

import com.bezkoder.springjwt.models.ApplicationOpenSource;
import com.bezkoder.springjwt.service.ApplicationOpenSourceServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:4200")
public class ApplicationOpenSourceController {

    @Autowired
    private ApplicationOpenSourceServiceImpl applicationOpenSourceService;

    @PostMapping("/add")
    public ApplicationOpenSource saveApplication(@RequestBody ApplicationOpenSource app) {
        return applicationOpenSourceService.saveApplication(app);
    }

    @GetMapping("/all")
    public List<ApplicationOpenSource> getAllApplications() {
        return applicationOpenSourceService.getAllApplications();
    }

    @GetMapping("/{id}")
    public ApplicationOpenSource getApplicationById(@PathVariable Long id) {
        return applicationOpenSourceService.getApplicationById(id);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteApplication(@PathVariable Long id) {
        applicationOpenSourceService.deleteApplication(id);
    }
    @PutMapping("/update/{id}")
    public ApplicationOpenSource updateApplication(@PathVariable Long id, @RequestBody ApplicationOpenSource appDetails) {
        return applicationOpenSourceService.updateApplication(id, appDetails);
    }
    @GetMapping("/count")
    public long countAllApplications() {
        return applicationOpenSourceService.countAllApplications();
    }

}
