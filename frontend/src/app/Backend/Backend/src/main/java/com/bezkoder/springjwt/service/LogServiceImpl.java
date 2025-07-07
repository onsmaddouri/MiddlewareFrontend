package com.bezkoder.springjwt.service;

import com.bezkoder.springjwt.models.Log;
import com.bezkoder.springjwt.repository.LogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class LogServiceImpl implements ILogService {

    @Autowired
    private LogRepository logRepository;

    @Override
    public Log saveLog(Log log) {
        return logRepository.save(log);
    }

    @Override
    public List<Log> getAllLogs() {
        return logRepository.findAll();
    }

    @Override
    public Log getLogById(Long id) {
        return logRepository.findById(id).orElse(null);
    }

    @Override
    public void deleteLog(Long id) {
        logRepository.deleteById(id);
    }
}
