package com.bezkoder.springjwt.controllers;

import com.bezkoder.springjwt.models.ServiceEntity;
import com.bezkoder.springjwt.service.ServiceEntityServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "http://localhost:4200")
public class ServiceEntityController {

    @Autowired
    private ServiceEntityServiceImpl serviceEntityService;

    @PostMapping
    public ServiceEntity saveService(@RequestBody ServiceEntity serviceEntity) {
        return serviceEntityService.saveService(serviceEntity);
    }

    @GetMapping
    public List<ServiceEntity> getAllServices() {
        return serviceEntityService.getAllServices();
    }

    @GetMapping("/{id}")
    public ServiceEntity getServiceById(@PathVariable Long id) {
        return serviceEntityService.getServiceById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteService(@PathVariable Long id) {
        serviceEntityService.deleteService(id);
    }
}
