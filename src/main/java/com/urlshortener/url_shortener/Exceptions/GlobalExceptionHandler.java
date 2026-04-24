package com.urlshortener.url_shortener.Exceptions;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        return new ResponseEntity<>(
                new ErrorResponse(404, ex.getMessage(), LocalDateTime.now()),
                HttpStatus.NOT_FOUND
        );
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ErrorResponse> handleBadRequest(BadRequestException ex) {
        return new ResponseEntity<>(
                new ErrorResponse(400, ex.getMessage(), LocalDateTime.now()),
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrity(DataIntegrityViolationException ex) {
        log.warn("Data integrity violation", ex);
        return new ResponseEntity<>(
                new ErrorResponse(400, "Invalid request", LocalDateTime.now()),
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleUnreadableJson(HttpMessageNotReadableException ex) {
        return new ResponseEntity<>(
                new ErrorResponse(400, "Malformed JSON request body", LocalDateTime.now()),
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorized(UnauthorizedException ex) {
        return new ResponseEntity<>(
                new ErrorResponse(401, ex.getMessage(), LocalDateTime.now()),
                HttpStatus.UNAUTHORIZED
        );
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ErrorResponse> handleNoResource(NoResourceFoundException ex) {
        return new ResponseEntity<>(
                new ErrorResponse(404, "Not found", LocalDateTime.now()),
                HttpStatus.NOT_FOUND
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex) {
        log.error("Unhandled exception", ex);
        return new ResponseEntity<>(
                new ErrorResponse(500, "Something went wrong", LocalDateTime.now()),
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
}