package com.bezkoder.springjwt.security.jwt;

import java.io.IOException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.bezkoder.springjwt.security.services.UserDetailsServiceImpl;

public class AuthTokenFilter extends OncePerRequestFilter {
  @Autowired
  private JwtUtils jwtUtils;

  @Autowired
  private UserDetailsServiceImpl userDetailsService;

  private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    try {
      String jwt = parseJwt(request);
      logger.debug("Received JWT token: {}", jwt);  // Log le token reçu

      if (jwt != null) {
        // Valider le token avant de l'utiliser
        if (jwtUtils.validateJwtToken(jwt)) {
          String username = jwtUtils.getUserNameFromJwtToken(jwt);
          logger.debug("Username from token: {}", username);  // Log le username extrait

          UserDetails userDetails = userDetailsService.loadUserByUsername(username);
          logger.debug("User authorities: {}", userDetails.getAuthorities());  // Log les autorités

          UsernamePasswordAuthenticationToken authentication =
              new UsernamePasswordAuthenticationToken(
                  userDetails,
                  null,
                  userDetails.getAuthorities());
          
          authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

          SecurityContextHolder.getContext().setAuthentication(authentication);
          logger.debug("Authentication set in SecurityContext");  // Log la confirmation
        } else {
          logger.error("JWT token validation failed");  // Log l'échec de validation
        }
      } else {
        logger.debug("No JWT token found in request");  // Log l'absence de token
      }
    } catch (Exception e) {
      logger.error("Cannot set user authentication: {}", e.getMessage());
      e.printStackTrace();  // Ajouter la stack trace pour plus de détails
    }

    filterChain.doFilter(request, response);
  }

  private String parseJwt(HttpServletRequest request) {
    String headerAuth = request.getHeader("Authorization");
    logger.debug("Authorization header: {}", headerAuth);  // Log le header d'autorisation

    if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
      return headerAuth.substring(7);
    }

    return null;
  }
}
