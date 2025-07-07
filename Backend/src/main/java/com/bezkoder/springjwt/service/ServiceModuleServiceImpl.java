package com.bezkoder.springjwt.service;

import com.bezkoder.springjwt.models.ServiceModule;
import com.bezkoder.springjwt.repository.ServiceModuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ServiceModuleServiceImpl implements IServiceModuleService {

    @Autowired
    private ServiceModuleRepository serviceModuleRepository;

    @Override
    public ServiceModule saveServiceModule(ServiceModule serviceModule) {
        return serviceModuleRepository.save(serviceModule);
    }

    @Override
    public List<ServiceModule> getAllServiceModules() {
        return serviceModuleRepository.findAll();
    }

    @Override
    public ServiceModule getServiceModuleById(Long id) {
        return serviceModuleRepository.findById(id).orElse(null);
    }

    @Override
    public void deleteServiceModule(Long id) {
        serviceModuleRepository.deleteById(id);
    }
}
