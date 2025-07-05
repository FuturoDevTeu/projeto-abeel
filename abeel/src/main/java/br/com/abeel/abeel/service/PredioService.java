package br.com.abeel.abeel.service;

import br.com.abeel.abeel.controller.dto.ElevadorEntradaDto;
import br.com.abeel.abeel.controller.dto.PredioEntradaDto;
import br.com.abeel.abeel.controller.dto.PredioSaidaDto;
import br.com.abeel.abeel.entity.Elevador;
import br.com.abeel.abeel.entity.Predio;
import br.com.abeel.abeel.repository.PredioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class PredioService {
    @Autowired
    private PredioRepository pr;

    private ResponseEntity<?> validarCampos(PredioEntradaDto dto, String acao, UUID idPredio){
        if(dto.nome() == null || dto.nome().trim().isEmpty()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Nome está em branco");
        if(dto.bairro() == null || dto.bairro().trim().isEmpty()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Bairro está em branco");

        if(!dto.nome().matches("^[\\p{L} ]{3,}$")) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Nome inválido");
        if(!dto.bairro().matches("^[\\p{L} ]{3,}$")) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Bairro inválido");

        if(acao.equals("cadastrar")){
            if(pr.findByNomeAndBairro(dto.nome(), dto.bairro()).isPresent()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Este prédio já existe");
        }
        if(acao.equals("editar")){
            if (pr.findByNomeAndBairroAndIdNot(dto.nome(),dto.bairro(), idPredio).isPresent()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Já existe um prédio com esse nome e bairro");
        }

        return ResponseEntity.ok().build();
    }

    private ResponseEntity<?> validarPredio(UUID idPredio){
        var predioOptional = pr.findById(idPredio);

        if(predioOptional.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Prédio não encontrado");

        return ResponseEntity.status(HttpStatus.OK).body(predioOptional.get());
    }

    public ResponseEntity<?> cadastrar(PredioEntradaDto dto){
        ResponseEntity<?> respostaValidacao = validarCampos(dto, "cadastrar", null);

        if(respostaValidacao.getStatusCode() != HttpStatus.OK) return  respostaValidacao;

        var predio = new Predio(
                dto.nome(),
                dto.bairro()
        );
        pr.save(predio);
        return ResponseEntity.status(HttpStatus.CREATED).body("Prédio criado com sucesso");
    }

    public ResponseEntity<?> listar(){
        Iterable<Predio> lista = pr.findAll();

        List<PredioSaidaDto> dtoList = new ArrayList<>();

        for(Predio predio : lista){
            List<ElevadorEntradaDto> elevadorEntradaDtos = new ArrayList<>();
            for(Elevador elevador : predio.getElevadores()){
                elevadorEntradaDtos.add(ElevadorEntradaDto.somenteModelo(elevador.getModelo()));
            }
            dtoList.add(new PredioSaidaDto(predio.getId(), predio.getNome(), predio.getBairro(), elevadorEntradaDtos));
        }

        return ResponseEntity.status(HttpStatus.OK).body(dtoList);
    }

    public ResponseEntity<?> buscar(String nome){
        List<Predio> lista = pr.findByNomeContaining(nome);
        List<PredioSaidaDto> dtoList = new ArrayList<>();

        for(Predio predio : lista){
            List<ElevadorEntradaDto> elevadorEntradaDto = new ArrayList<>();
            for(Elevador elevador : predio.getElevadores()){
                elevadorEntradaDto.add(ElevadorEntradaDto.somenteModelo(elevador.getModelo()));
            }
            dtoList.add(new PredioSaidaDto(predio.getId(), predio.getNome(), predio.getBairro(), elevadorEntradaDto));
        }

        return ResponseEntity.status(HttpStatus.OK).body(dtoList);
    }

    public ResponseEntity<?> remover(UUID idPredio){
        var predioOptional = pr.findById(idPredio);

        if(predioOptional.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Prédio não encontrado");

        var predio = predioOptional.get();
        pr.delete(predio);
        return ResponseEntity.status(HttpStatus.OK).body("Prédio removido com sucesso");
    }

    public ResponseEntity<?> editar(PredioEntradaDto dto, UUID idPredio){
        ResponseEntity<?> respostaPredio = validarPredio(idPredio);
        ResponseEntity<?> respostaValidacao = validarCampos(dto, "editar", idPredio);

        if(respostaPredio.getStatusCode() != HttpStatus.OK) return respostaPredio;
        if(respostaValidacao.getStatusCode() != HttpStatus.OK) return  respostaValidacao;

        var predio = (Predio) respostaPredio.getBody();

        predio.setBairro(dto.bairro());
        predio.setNome(dto.nome());

        pr.save(predio);
        return ResponseEntity.status(HttpStatus.OK).body("Prédio alterado com sucesso");
    }
}
