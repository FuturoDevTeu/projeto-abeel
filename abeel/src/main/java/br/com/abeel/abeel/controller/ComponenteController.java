package br.com.abeel.abeel.controller;

import br.com.abeel.abeel.controller.dto.ComponenteEntradaDto;
import br.com.abeel.abeel.service.ComponenteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/componente")
public class ComponenteController {

    @Autowired
    private ComponenteService cs;

    @PostMapping(path = "/{idElevador}/cadastrar", consumes = "multipart/form-data")
    public ResponseEntity<?> cadastrar(
            @PathVariable("idElevador") UUID idElevador,
            @RequestParam("nome") String nome,
            @RequestParam("situacao") boolean situacao,
            @RequestParam("imagem")MultipartFile imagem,
            @RequestParam("hePadrao") boolean hePadrao
    ){
        return cs.cadastrar(idElevador, nome, situacao, imagem, hePadrao);
    }

    @GetMapping("/{idElevador}/listar")
    public ResponseEntity<?> listar(@PathVariable("idElevador") UUID idElevador){
        return cs.listar(idElevador);
    }

    @GetMapping("/{idElevador}/{nome}")
    public ResponseEntity<?> buscar(@PathVariable("idElevador") UUID idElevador, @PathVariable("nome") String nome){
        return cs.buscar(idElevador, nome);
    }

    @DeleteMapping("/{idElevador}/{idComponente}")
    public ResponseEntity<?> deletar(@PathVariable("idElevador") UUID idElevador, @PathVariable("idComponente") UUID idComponente){
        return cs.remover(idElevador, idComponente);
    }

    @PutMapping("/{idElevador}/{idComponente}")
    public ResponseEntity<?> editar(@PathVariable("idElevador") UUID idElevador, @PathVariable("idComponente") UUID idComponente, @RequestBody ComponenteEntradaDto dto){
        return cs.editar(idElevador, idComponente, dto);
    }
}
