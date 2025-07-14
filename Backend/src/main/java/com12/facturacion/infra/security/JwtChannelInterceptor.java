package com12.facturacion.infra.security;

import com12.facturacion.infra.security.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Collections;

@Component
public class JwtChannelInterceptor implements ChannelInterceptor {

    @Autowired
    private TokenService tokenService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        if (accessor.getCommand() != null && accessor.getCommand().toString().equals("CONNECT")) {
            String authHeader = accessor.getFirstNativeHeader("Authorization");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                try {
                    String token = authHeader.substring(7);
                    String username = tokenService.getNameToken(token);
                    String role = tokenService.getRoleFromToken(token);

                    SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role);
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(username, null, Collections.singletonList(authority));

                    accessor.setUser(authentication);
                    SecurityContextHolder.getContext().setAuthentication(authentication); // ✅ este era el detalle

                } catch (Exception e) {
                    System.err.println("❌ Token inválido en WebSocket: " + e.getMessage());
                    return null; // Bloquea conexión si falla
                }
            } else {
                System.err.println("⚠️ No se encontró el token JWT en el header CONNECT");
                return null;
            }
        }

        return message;
    }
}
