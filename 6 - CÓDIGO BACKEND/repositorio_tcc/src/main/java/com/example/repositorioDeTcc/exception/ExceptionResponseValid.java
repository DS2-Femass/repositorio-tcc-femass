package com.example.repositorioDeTcc.exception;

import lombok.Data;
import lombok.Setter;

import java.io.Serializable;
import java.util.Date;
import java.util.Map;

@Data
public class ExceptionResponseValid {
    @Setter
    private Date timestamp;
    @Setter
    private String message;
    @Setter
    private String details;
    private Map<String, String> fieldErrors;

    public ExceptionResponseValid(Date timestamp, String message, String details, Map<String, String> fieldErrors) {
        this.timestamp = timestamp;
        this.message = message;
        this.details = details;
        this.fieldErrors = fieldErrors;
    }
    public Date getTimestamp() {
        return timestamp;
    }

    public String getMessage() {
        return message;
    }

    public String getDetails() {
        return details;
    }

    public Map<String, String> getFieldErrors() { return fieldErrors; }
}
