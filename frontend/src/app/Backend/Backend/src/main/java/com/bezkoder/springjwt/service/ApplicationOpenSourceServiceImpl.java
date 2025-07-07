package com.bezkoder.springjwt.service;

import com.bezkoder.springjwt.models.ApplicationOpenSource;
import com.bezkoder.springjwt.repository.ApplicationOpenSourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ApplicationOpenSourceServiceImpl implements IApplicationOpenSourceService {

    @Autowired
    private ApplicationOpenSourceRepository applicationOpenSourceRepository;

    @Override
    public ApplicationOpenSource saveApplication(ApplicationOpenSource app) {
        return applicationOpenSourceRepository.save(app);
    }

    @Override
    public List<ApplicationOpenSource> getAllApplications() {
        return applicationOpenSourceRepository.findAll();
    }

    @Override
    public ApplicationOpenSource getApplicationById(Long id) {
        return applicationOpenSourceRepository.findById(id).orElse(null);
    }

    @Override
    public void deleteApplication(Long id) {
        applicationOpenSourceRepository.deleteById(id);
    }

    @Override
    public ApplicationOpenSource updateApplication(Long id, ApplicationOpenSource appDetails) {
        ApplicationOpenSource app = getApplicationById(id);
        if (app != null) {
            app.setNom(appDetails.getNom());
            app.setDescription(appDetails.getDescription());
            app.setVersion(appDetails.getVersion());
            app.setLogoUrl(appDetails.getLogoUrl());
            return saveApplication(app);
        } else {
            throw new RuntimeException("ApplicationOpenSource not found with id " + id);
        }
    }

    @Override
    public long countAllApplications() {
        return applicationOpenSourceRepository.count();

    }
}
