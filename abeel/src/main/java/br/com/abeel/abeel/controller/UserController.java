package br.com.abeel.abeel.controller;

import br.com.abeel.abeel.controller.dto.LoginEntradaDto;
import br.com.abeel.abeel.service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private TokenService tks;

    @RequestMapping("/register")
    public ResponseEntity<?> cadastrar(@RequestBody LoginEntradaDto dto){
        return tks.registrar(dto);
    }
}
