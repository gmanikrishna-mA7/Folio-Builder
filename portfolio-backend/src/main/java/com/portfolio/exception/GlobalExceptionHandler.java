package com.portfolio.exception;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    // Structured Error Response Record
    public record ErrorResponse(
        String timestamp,
        int status,
        String error,
        String message,
        Map<String, String> errors
    ) {}

    // 1. Handle Validation Failures (MethodArgumentNotValidException)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        ErrorResponse response = new ErrorResponse(
            LocalDateTime.now().format(FORMATTER),
            HttpStatus.BAD_REQUEST.value(),
            "Validation Failed",
            "Input validation failed. Please check the 'errors' field for details.",
            errors
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    // 2. Handle Entity Not Found (EntityNotFoundException)
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleEntityNotFound(EntityNotFoundException ex) {
        ErrorResponse response = new ErrorResponse(
            LocalDateTime.now().format(FORMATTER),
            HttpStatus.NOT_FOUND.value(),
            "Resource Not Found",
            ex.getMessage(),
            null
        );
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    // 3. Handle File Upload Exceeding Size Limit (MaxUploadSizeExceededException)
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ErrorResponse> handleMaxSizeException(MaxUploadSizeExceededException ex) {
        ErrorResponse response = new ErrorResponse(
            LocalDateTime.now().format(FORMATTER),
            HttpStatus.PAYLOAD_TOO_LARGE.value(),
            "Max Upload Size Exceeded",
            "File size exceeds the configured maximum limit of 10MB.",
            null
        );
        return new ResponseEntity<>(response, HttpStatus.PAYLOAD_TOO_LARGE);
    }

    // 4. Handle Runtime/Custom Exceptions (e.g. FileNotFound, General Storage Errors)
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex) {
        ErrorResponse response = new ErrorResponse(
            LocalDateTime.now().format(FORMATTER),
            HttpStatus.BAD_REQUEST.value(),
            "Bad Request",
            ex.getMessage(),
            null
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    // 5. Handle Spring Security BadCredentialsException
    @ExceptionHandler(org.springframework.security.authentication.BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(org.springframework.security.authentication.BadCredentialsException ex) {
        ErrorResponse response = new ErrorResponse(
            LocalDateTime.now().format(FORMATTER),
            HttpStatus.UNAUTHORIZED.value(),
            "Unauthorized",
            "Invalid email or password combination.",
            null
        );
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    // 6. Handle general Spring Security AuthenticationExceptions
    @ExceptionHandler(org.springframework.security.core.AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthenticationException(org.springframework.security.core.AuthenticationException ex) {
        ErrorResponse response = new ErrorResponse(
            LocalDateTime.now().format(FORMATTER),
            HttpStatus.UNAUTHORIZED.value(),
            "Unauthorized",
            ex.getMessage(),
            null
        );
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    // 7. Fallback Exception Handler for unexpected server failures
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(Exception ex) {
        ErrorResponse response = new ErrorResponse(
            LocalDateTime.now().format(FORMATTER),
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "Internal Server Error",
            "An unexpected error occurred. Please contact the administrator.",
            null
        );
        // Printing stack trace for server-side debugging
        ex.printStackTrace();
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
