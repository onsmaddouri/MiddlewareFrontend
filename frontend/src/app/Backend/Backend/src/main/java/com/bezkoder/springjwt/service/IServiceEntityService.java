package com.bezkoder.springjwt.service;

import com.bezkoder.springjwt.models.ServiceEntity;
import java.util.List;

public interface IServiceEntityService {
    ServiceEntity saveService(ServiceEntity serviceEntity);
    List<ServiceEntity> getAllServices();
    ServiceEntity getServiceById(Long id);
    void deleteService(Long id);
}
