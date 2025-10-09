package br.com.abeel.abeel.controller;

import br.com.abeel.abeel.controller.dto.EmpresaEntradaDto;
import br.com.abeel.abeel.service.EmpresaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/empresa")
@CrossOrigin(origins = "*")
public class EmpresaController {

    @Autowired
    private EmpresaService empresaService;

    @PostMapping("/cadastrar")
    public ResponseEntity<?> cadastar(@RequestBody EmpresaEntradaDto dto){
        return empresaService.cadastrar(dto);
    }

    @GetMapping("/todas")
    public ResponseEntity<?> listarTodas(){
        return empresaService.listarTodas();
    }

    @GetMapping("/buscar/predio/{predioId}")
    public ResponseEntity<?> buscarIdPredio(@PathVariable UUID predioId){
        return empresaService.buscarIdPredios(predioId);
    }
    

    @PutMapping("/editar/{empresaId}")
    public ResponseEntity<?> editar(@PathVariable("empresaId") UUID empresaId, @RequestBody EmpresaEntradaDto dto){
        return empresaService.editar(empresaId, dto);
    }

    @DeleteMapping("/deletar/{empresaId}")
    public ResponseEntity<?> deletar(@PathVariable("empresaId") UUID empresaId){
        return empresaService.deletar(empresaId);
    }

}
