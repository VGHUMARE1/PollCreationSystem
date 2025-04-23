package com.akanksh.security;

import org.springframework.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.client.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.*;

public class JwtAuthenticationFilter implements Filter {

    private final RestTemplate restTemplate;
    private final String authServerUrl;

    public JwtAuthenticationFilter(RestTemplate restTemplate, String authServerUrl) {
        this.restTemplate = restTemplate;
        this.authServerUrl = authServerUrl;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

    	System.out.println("Inside the doFiltet method forn delete : " + request);
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        System.out.println(request);
        // Skip authentication for preflight requests
        System.out.println(httpRequest.getMethod());
        if ("OPTIONS".equalsIgnoreCase(httpRequest.getMethod())) {
        	
            chain.doFilter(request, response);
            return;
        }
        
        System.out.println("Http request recieved:" + httpRequest.getHeader("Authorization"));

        // Extract token from Authorization header
        String authHeader = httpRequest.getHeader("Authorization");
        System.out.println("Auth Header recieved " + authHeader);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            sendError(httpResponse, "Missing or invalid Authorization header ", HttpStatus.UNAUTHORIZED);
            return;
        }

        String token = authHeader.substring(7);

        try {
            // Prepare request to Node.js
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + token);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<Map> authResponse;
            try {
                authResponse = restTemplate.exchange(
                    authServerUrl,
                    HttpMethod.POST,
                    entity,
                    Map.class
                );
            } catch (HttpClientErrorException e) {
                sendError(httpResponse, "Token validation service returned error: " + e.getStatusCode(), e.getStatusCode());
                return;
            } catch (RestClientException e) {
                sendError(httpResponse, "Token validation service unavailable", HttpStatus.SERVICE_UNAVAILABLE);
                return;
            }

            // Check response
            if (authResponse.getBody() == null) {
                sendError(httpResponse, "Empty response from token validation service", HttpStatus.UNAUTHORIZED);
                return;
            }

            if (!Boolean.TRUE.equals(authResponse.getBody().get("isValid"))) {
                String errorMsg = (String) authResponse.getBody().getOrDefault("message", "Invalid token");
                sendError(httpResponse, errorMsg, HttpStatus.UNAUTHORIZED);
                return;
            }

            // Extract user details and set authentication
            Map<String, Object> userDetails = (Map<String, Object>) authResponse.getBody().get("user");
            if (userDetails != null) {
                String username = (String) userDetails.get("email");
                if (username != null) {
                    UsernamePasswordAuthenticationToken authentication = 
                        new UsernamePasswordAuthenticationToken(
                            username, 
                            null,
                            Collections.emptyList()
                        );
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }

            chain.doFilter(request, response);

        } catch (Exception e) {
            sendError(httpResponse, "Internal server error during authentication", HttpStatus.INTERNAL_SERVER_ERROR);
            e.printStackTrace();
        }
    }

    private void sendError(HttpServletResponse response, String message, HttpStatusCode status) throws IOException {
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(status.value());
        response.getWriter().write(String.format(
            "{\"error\": \"%s\", \"status\": %d, \"timestamp\": \"%s\"}",
            message,
            status.value(),
            new Date()
        ));
    }
}