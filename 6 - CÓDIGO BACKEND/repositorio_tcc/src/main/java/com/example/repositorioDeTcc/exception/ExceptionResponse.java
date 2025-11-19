package com.example.repositorioDeTcc.exception;

import lombok.Data;
import lombok.Setter;

import java.io.Serializable;
import java.util.Date;
import java.util.Map;


@Data
public class ExceptionResponse implements Serializable {
    @Setter
    private Date timestamp;
    @Setter
    private String message;
    @Setter
    private String details;

    public ExceptionResponse(Date timestamp, String message, String details) {
        this.timestamp = timestamp;
        this.message = message;
        this.details = details;
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

}
