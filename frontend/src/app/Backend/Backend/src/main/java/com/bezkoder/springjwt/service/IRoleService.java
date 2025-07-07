package com.bezkoder.springjwt.service;

import com.bezkoder.springjwt.models.Role;
import java.util.List;

public interface IRoleService {
    Role saveRole(Role role);
    List<Role> getAllRoles();
    Role getRoleById(Long id);
    void deleteRole(Long id);
}
