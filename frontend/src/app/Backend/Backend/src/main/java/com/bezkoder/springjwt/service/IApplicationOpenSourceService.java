package com.bezkoder.springjwt.service;

import com.bezkoder.springjwt.models.ApplicationOpenSource;
import java.util.List;

public interface IApplicationOpenSourceService {
    ApplicationOpenSource saveApplication(ApplicationOpenSource app);
    List<ApplicationOpenSource> getAllApplications();
    ApplicationOpenSource getApplicationById(Long id);
    void deleteApplication(Long id);
    ApplicationOpenSource updateApplication(Long id, ApplicationOpenSource appDetails);
    long countAllApplications();

}
