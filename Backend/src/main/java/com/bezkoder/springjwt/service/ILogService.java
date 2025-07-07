package com.bezkoder.springjwt.service;

import com.bezkoder.springjwt.models.Log;
import java.util.List;

public interface ILogService {
    Log saveLog(Log log);
    List<Log> getAllLogs();
    Log getLogById(Long id);
    void deleteLog(Long id);
}
