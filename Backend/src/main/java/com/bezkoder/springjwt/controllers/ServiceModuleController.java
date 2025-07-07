package com.bezkoder.springjwt.controllers;

import com.bezkoder.springjwt.models.ServiceModule;
import com.bezkoder.springjwt.service.ServiceModuleServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/service-modules")
@CrossOrigin(origins = "http://localhost:4200")
public class ServiceModuleController {

    @Autowired
    private ServiceModuleServiceImpl serviceModuleService;

    @PostMapping
    public ServiceModule saveServiceModule(@RequestBody ServiceModule serviceModule) {
        return serviceModuleService.saveServiceModule(serviceModule);
    }

    @GetMapping
    public List<ServiceModule> getAllServiceModules() {
        return serviceModuleService.getAllServiceModules();
    }

    @GetMapping("/{id}")
    public ServiceModule getServiceModuleById(@PathVariable Long id) {
        return serviceModuleService.getServiceModuleById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteServiceModule(@PathVariable Long id) {
        serviceModuleService.deleteServiceModule(id);
    }
}
