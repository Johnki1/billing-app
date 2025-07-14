package com12.facturacion.infra.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {
    public RestTemplate  restTemplate(){
        return new RestTemplate();
    }
}
