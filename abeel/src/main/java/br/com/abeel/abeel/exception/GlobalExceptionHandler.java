package br.com.abeel.abeel.exception;

import org.apache.catalina.connector.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CampoVazioException.class)
    public ResponseEntity<?> handlerCampoVazioException(CampoVazioException ex){
        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(EmpresaNaoEncontradaException.class)
    public ResponseEntity<?> handlerEmpresaNaoEncontradaException(EmpresaNaoEncontradaException ex){
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(PredioNaoEncontradoException.class)
    public ResponseEntity<?> handlerPredioNaoEncontradoException(PredioNaoEncontradoException ex){
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(PredioJaExisteException.class)
    public ResponseEntity<?> handlerPredioJaExisteException(PredioJaExisteException ex){
        return buildResponse(HttpStatus.CONFLICT, ex.getMessage());
    }

    @ExceptionHandler(EmpresaNaoEncontradaException.class)
    public ResponseEntity<?> handlerElevadorNaoEncontradoException(ElevadorNaoEncontradoException ex){
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(ImagemIncorretaException.class)
    public ResponseEntity<?> handlerImagemIncorretaException(ImagemIncorretaException ex){
        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(ComponenteNaoEncontradoException.class)
    public ResponseEntity<?> handlerComponenteNaoEncontradoException(ComponenteNaoEncontradoException ex){
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    public ResponseEntity<?> handlerComponenteJaExisteException(ComponenteJaExisteException ex){
        return buildResponse(HttpStatus.CONFLICT, ex.getMessage());
    }



    private ResponseEntity<?> buildResponse(HttpStatus status, String message){
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        return ResponseEntity.status(status).body(body);
    }
}
