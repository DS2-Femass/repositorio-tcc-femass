package com.example.repositorioDeTcc.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@RequiredArgsConstructor
public enum Role {
    ADMIN(
            Set.of(
                    Permission.ADMIN_DELETE,
                    Permission.ADMIN_UPDATE,
                    Permission.ADMIN_CREATE,
                    Permission.ADMIN_READ,
                    Permission.MODERATOR_DELETE,
                    Permission.MODERATOR_CREATE,
                    Permission.MODERATOR_UPDATE,
                    Permission.MODERATOR_READ,
                    Permission.USER_DELETE,
                    Permission.USER_UPDATE,
                    Permission.USER_CREATE,
                    Permission.USER_READ
            )
    ),
    MODERATOR(
            Set.of(
                    Permission.MODERATOR_DELETE,
                    Permission.MODERATOR_UPDATE,
                    Permission.MODERATOR_CREATE,
                    Permission.MODERATOR_READ,
                    Permission.USER_DELETE,
                    Permission.USER_UPDATE,
                    Permission.USER_CREATE,
                    Permission.USER_READ
            )
    ),
    USER(
            Set.of(
                    Permission.USER_READ,
                    Permission.USER_UPDATE,
                    Permission.USER_DELETE,
                    Permission.USER_CREATE
            )
    ),
    LIMITED(Collections.emptySet()),
    TOCHANGE(Collections.emptySet());

    private final Set<Permission> permissions;

    public List<SimpleGrantedAuthority> getAuthorities() {
        var authorities = getPermissions()
                .stream()
                .map(permission -> new SimpleGrantedAuthority(permission.getPermission()))
                .collect(Collectors.toList());
        authorities.add(new SimpleGrantedAuthority("ROLE_" + this.name()));
        return authorities;
    }
};
