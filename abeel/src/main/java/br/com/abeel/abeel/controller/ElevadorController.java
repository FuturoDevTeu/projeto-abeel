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
    public ResponseEntity<?> cadastrar(@PathVariable("idPredio") UUID idPredio, @RequestBody ElevadorEntradaDto dto){return es.cadastrar(idPredio, dto);}

    @GetMapping("/{idPredio}/listar")
    public ResponseEntity<?> listar(@PathVariable("idPredio") UUID idPredio){
        return es.listar(idPredio);
    }

    @GetMapping("/{idPredio}/{modelo}")
    public ResponseEntity<?> buscar(@PathVariable("idPredio") UUID idPredio, @PathVariable String modelo){
        return es.buscar(idPredio, modelo);
    }
    @GetMapping("/{idElevador}/buscar")
    public ResponseEntity<?> buscarId(@PathVariable("idElevador") UUID idElevador){
        return es.buscarPeloId(idElevador);
    }

    @DeleteMapping("/{idElevador}")
    public ResponseEntity<?> remover(@PathVariable("idElevador") UUID idElevador){
        return es.remover(idElevador);
    }

    @PutMapping("/{idElevador}")
    public ResponseEntity<?> editar(@PathVariable("idElevador") UUID idElevador, @RequestBody ElevadorEntradaDto dto){
        return es.editar(idElevador, dto);
    }

    @GetMapping("/{idElevador}/relatorio")
    public ResponseEntity<?> gerarRelatorio(@PathVariable("idElevador") UUID idElevador){
        var resposta = es.gerarRelatorio(idElevador);

        if(resposta.getStatusCode() != HttpStatus.OK) return resposta;

        byte[] pdf = (byte[]) resposta.getBody();

        HttpHeaders header = new HttpHeaders();
        header.setContentType(MediaType.APPLICATION_PDF);
        header.setContentDispositionFormData("inline", "relatorio_ria.pdf");

        return new ResponseEntity<>(pdf, header, HttpStatus.OK);
    }
}
