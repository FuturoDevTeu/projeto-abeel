package br.com.abeel.abeel.controller;

import br.com.abeel.abeel.controller.dto.PredioEntradaDto;
import br.com.abeel.abeel.service.PredioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/predio")
@CrossOrigin(origins = "*")
public class PredioController {

    @Autowired
    private PredioService ps;

    @PostMapping("/cadastrar")
    private ResponseEntity<?> cadastrar(@RequestBody PredioEntradaDto dto){
        return ps.cadastrar(dto);
    }

    @GetMapping("/listar")
    private ResponseEntity<?> listar(){
        return ps.listar();
    }

    @GetMapping("/buscar/{nome}")
    private ResponseEntity<?> buscar(@PathVariable("nome") String nome){
        return ps.buscar(nome);
    }

    @DeleteMapping("/deletar/{idPredio}")
    private ResponseEntity<?> remover(@PathVariable("idPredio") UUID idPredio){
        return ps.remover(idPredio);
    }

    @PutMapping("/editar/{idPredio}")
    private ResponseEntity<?> editar(@PathVariable("/idPredio") UUID idPredio, @RequestBody PredioEntradaDto dto){
        return ps.editar(dto, idPredio);
    }
}
