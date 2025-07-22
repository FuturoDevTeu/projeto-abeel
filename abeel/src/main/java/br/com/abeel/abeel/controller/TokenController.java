package br.com.abeel.abeel.controller;

import br.com.abeel.abeel.controller.dto.LoginEntradaDto;
import br.com.abeel.abeel.controller.dto.LoginSaidaDto;
import br.com.abeel.abeel.service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class TokenController {

    @Autowired
    private TokenService tks;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginEntradaDto dto){
        return tks.logar(dto);
    }
}
