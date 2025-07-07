package com.bezkoder.springjwt.controllers;

import com.bezkoder.springjwt.models.ERP;
import com.bezkoder.springjwt.service.ERPServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/erps")
@CrossOrigin(origins = "http://localhost:4200")
public class ERPController {

    @Autowired
    private ERPServiceImpl erpService;

    @PostMapping
    public ERP saveERP(@RequestBody ERP erp) {
        return erpService.saveERP(erp);
    }

    @GetMapping
    public List<ERP> getAllERPs() {
        return erpService.getAllERPs();
    }

    @GetMapping("/{id}")
    public ERP getERPById(@PathVariable Long id) {
        return erpService.getERPById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteERP(@PathVariable Long id) {
        erpService.deleteERP(id);
    }
    @PutMapping("/{id}")
    public ERP updateERP(@PathVariable Long id, @RequestBody ERP erpDetails) {
        return erpService.updateERP(id, erpDetails);
    }
    @GetMapping("/count")
    public long countAllErps() {
        return erpService.countAllErps();
    }
}
