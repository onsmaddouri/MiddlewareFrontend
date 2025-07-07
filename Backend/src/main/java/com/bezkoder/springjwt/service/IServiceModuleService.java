package com.bezkoder.springjwt.service;

import com.bezkoder.springjwt.models.ServiceModule;
import java.util.List;

public interface IServiceModuleService {
    ServiceModule saveServiceModule(ServiceModule serviceModule);
    List<ServiceModule> getAllServiceModules();
    ServiceModule getServiceModuleById(Long id);
    void deleteServiceModule(Long id);
}
