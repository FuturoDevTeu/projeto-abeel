package br.com.abeel.abeel.controller;

import br.com.abeel.abeel.controller.dto.ElevadorEntradaDto;
import br.com.abeel.abeel.service.ElevadorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/elevador")
@CrossOrigin(origins = "*")
public class ElevadorController {

    @Autowired
    private ElevadorService es;

    @PostMapping("/{idPredio}/cadastrar")
    private ResponseEntity<?> cadastrar(@PathVariable("idPredio") UUID idPredio, @RequestBody ElevadorEntradaDto dto){return es.cadastrar(idPredio, dto);}

    @GetMapping("/{idPredio}/listar")
    private ResponseEntity<?> listar(@PathVariable("idPredio") UUID idPredio){
        return es.listar(idPredio);
    }

    @GetMapping("/{idPredio}/{modelo}")
    private ResponseEntity<?> buscar(@PathVariable("idPredio") UUID idPredio, @PathVariable String modelo){
        return es.buscar(idPredio, modelo);
    }

    @DeleteMapping("/{idPredio}/{idElevador}")
    private ResponseEntity<?> remover(@PathVariable("idPredio") UUID idPredio, @PathVariable("idElevador") UUID idElevador){
        return es.remover(idPredio, idElevador);
    }

    @PutMapping("/{idPredio}/{idElevador}")
    private ResponseEntity<?> editar(@PathVariable("idPredio") UUID idPredio, @PathVariable("idElevador") UUID idElevador, @RequestBody ElevadorEntradaDto dto){
        return es.editar(idPredio, idElevador, dto);
    }

    @GetMapping("/{idElevador}/relatorio")
    private ResponseEntity<?> gerarRelatorio(@PathVariable("idElevador") UUID idElevador){
        var resposta = es.gerarRelatorio(idElevador);

        if(resposta.getStatusCode() != HttpStatus.OK) return resposta;

        byte[] pdf = (byte[]) resposta.getBody();

        HttpHeaders header = new HttpHeaders();
        header.setContentType(MediaType.APPLICATION_PDF);
        header.setContentDispositionFormData("inline", "relatorio_ria.pdf");

        return new ResponseEntity<>(pdf, header, HttpStatus.OK);
    }
}
