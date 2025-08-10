package br.com.abeel.abeel.service;

import br.com.abeel.abeel.controller.dto.LoginEntradaDto;
import br.com.abeel.abeel.controller.dto.LoginSaidaDto;
import br.com.abeel.abeel.entity.Role;
import br.com.abeel.abeel.entity.User;
import br.com.abeel.abeel.repository.UserRepository;
import com.nimbusds.jwt.JWTClaimsSet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.graphql.GraphQlProperties;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;

import java.time.Instant;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TokenService {

    @Autowired
    private UserRepository ur;

    @Autowired
    private JwtEncoder jwtEncoder;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    private ResponseEntity<?> verificarLogin(LoginEntradaDto dto) {
        var optionalUser = ur.findByUsername(dto.username());
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error","Login ou senha inválidos"));
        }

        var user = optionalUser.get();
        var senha = passwordEncoder.matches(dto.password(), user.getPassword());

        if (!senha) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error","Login ou senha inválidos"));
        }

        return ResponseEntity.ok(user);
    }


    private ResponseEntity verificarCredenciais(LoginEntradaDto dto){
        var optionalUser = ur.findByUsername(dto.username());

        if(optionalUser.isPresent()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Usuário já existe");
        }
        var user = (User) optionalUser.get();

        if(user.getUsername().trim().isEmpty()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Nome de usuário em branco");
        }

        if(!user.getUsername().matches("^[\\p{L} ]{3,}$")){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Somente letras e espaço em branco são permitidos");
        }

        if(user.getPassword().trim().isEmpty()){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Senha do usuário está em branco");
        }

        if(!user.getPassword().matches("^[\\p{L}\\p{N}]{5,}")){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Somente letras e numeros são permitidos e deve ter no minimo 5 caracteres");
        }
        return ResponseEntity.status(HttpStatus.OK).body(user);
    }

    public ResponseEntity<?> logar(LoginEntradaDto dto){
        var resposta = verificarLogin(dto);

        if(resposta.getStatusCode() != HttpStatus.OK){
            return resposta;
        }
        var user = (User) resposta.getBody();

        var criacao = Instant.now();
        var expiracao = 500L;

        var scopes =user.getRole()
                .stream()
                .map(Role::getNome)
                .collect(Collectors.joining(" "));

        var claims = JwtClaimsSet.builder()
                .issuer("backend")
                .subject(user.getUsername())
                .expiresAt(criacao.plusSeconds(expiracao))
                .claim("scope", scopes)
                .build();

        var jwtValue = jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();

        return ResponseEntity.status(HttpStatus.OK).body(new LoginSaidaDto(jwtValue, expiracao));
    }

    public ResponseEntity<?> registrar(LoginEntradaDto dto){
        var resposta = verificarCredenciais(dto);

        if(resposta.getStatusCode() != HttpStatus.OK){
            return  resposta;
        }

        var user = (User) resposta.getBody();

        user.setPassword(passwordEncoder.encode(dto.password()));
        ur.save(user);
        return ResponseEntity.status(HttpStatus.OK).body("Usuario cadastrado com sucesso");
    }

}
