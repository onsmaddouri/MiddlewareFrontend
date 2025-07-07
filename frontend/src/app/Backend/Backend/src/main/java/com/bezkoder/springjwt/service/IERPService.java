package com.bezkoder.springjwt.service;

import com.bezkoder.springjwt.models.ERP;
import java.util.List;

public interface IERPService {
    ERP saveERP(ERP erp);
    List<ERP> getAllERPs();
    ERP getERPById(Long id);
    void deleteERP(Long id);
    ERP updateERP(Long id, ERP erpDetails);
    long countAllErps();

}
