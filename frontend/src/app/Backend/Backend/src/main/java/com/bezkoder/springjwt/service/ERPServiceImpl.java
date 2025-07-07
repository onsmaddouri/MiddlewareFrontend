package com.bezkoder.springjwt.service;

import com.bezkoder.springjwt.models.ERP;
import com.bezkoder.springjwt.repository.ERPRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ERPServiceImpl implements IERPService {

    @Autowired
    private ERPRepository erpRepository;

    @Override
    public ERP saveERP(ERP erp) {
        return erpRepository.save(erp);
    }

    @Override
    public List<ERP> getAllERPs() {
        return erpRepository.findAll();
    }

    @Override
    public ERP getERPById(Long id) {
        return erpRepository.findById(id).orElse(null);
    }

    @Override
    public void deleteERP(Long id) {
        erpRepository.deleteById(id);
    }



    @Override
    public ERP updateERP(Long id, ERP erpDetails) {
        ERP erp = getERPById(id);
        if (erp != null) {
            erp.setNom(erpDetails.getNom());
            erp.setDescription(erpDetails.getDescription());
            erp.setVersion(erpDetails.getVersion());
            erp.setLogoUrl(erpDetails.getLogoUrl());
            return saveERP(erp);
        } else {
            throw new RuntimeException("ERP not found with id " + id);
        }
    }

    @Override
    public long countAllErps() {
        return erpRepository.count();

    }
}
