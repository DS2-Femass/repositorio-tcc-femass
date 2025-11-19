package com.example.repositorioDeTcc.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Permission {

    ADMIN_READ("admin:read"),
    ADMIN_UPDATE("admin:updade"),
    ADMIN_CREATE("admin:create"),
    ADMIN_DELETE("admin:delete"),

    MODERATOR_READ("moderator:read"),
    MODERATOR_UPDATE("moderator:update"),
    MODERATOR_CREATE("moderator:create"),
    MODERATOR_DELETE("moderator:delete"),

    USER_READ("user:read"),
    USER_UPDATE("user:update"),
    USER_CREATE("user:create"),
    USER_DELETE("user:delete"),

    LIMITED_READ("limited:read"),
    TOCHANGE_READ("tochange:read");

    private final String permission;
}
