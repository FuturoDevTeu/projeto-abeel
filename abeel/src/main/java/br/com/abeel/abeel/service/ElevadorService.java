package br.com.abeel.abeel.service;

import br.com.abeel.abeel.controller.dto.ComponenteEntradaDto;
import br.com.abeel.abeel.controller.dto.ElevadorEntradaDto;
import br.com.abeel.abeel.controller.dto.ElevadorSaidaDto;
import br.com.abeel.abeel.entity.Componente;
import br.com.abeel.abeel.entity.Elevador;
import br.com.abeel.abeel.entity.Predio;
import br.com.abeel.abeel.repository.ComponenteRepository;
import br.com.abeel.abeel.repository.ElevadorRepository;
import br.com.abeel.abeel.repository.PredioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;



@Service
public class ElevadorService {

    @Autowired
    private ElevadorRepository er;

    @Autowired
    private PredioRepository pr;

    @Autowired
    private ComponenteRepository cr;

    private ResponseEntity<?> validarCampos(ElevadorEntradaDto dto){

        if(dto.modelo() == null || dto.modelo().trim().isEmpty()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Modelo está em branco");

        if(!dto.modelo().matches("^[\\p{L}\\p{N} ]{3,}$")) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Modelo inválido");

        return ResponseEntity.status(HttpStatus.OK).build();
    }

    private ResponseEntity<?> validarPredio(UUID idPredio){
        var predioOptional = pr.findById(idPredio);

        if(predioOptional.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Prédio não encontrado");

        return ResponseEntity.status(HttpStatus.OK).body(predioOptional.get());
    }

    private ResponseEntity<?> validarElevadorPredio(UUID idPredio, UUID idElevaodr){
        var predioOptional = pr.findById(idPredio);

        if(predioOptional.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Prédio não encontrado");

        var elevadorOptional = er.findByIdAndPredio(idElevaodr, predioOptional.get());
        if(elevadorOptional.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Elevador não encontrado");

        return ResponseEntity.status(HttpStatus.OK).body(elevadorOptional.get());
    }

    public ResponseEntity<?> cadastrar(UUID idPredio, ElevadorEntradaDto dto){
        ResponseEntity<?> respostaPredio = validarPredio(idPredio);
        ResponseEntity<?> respostaCampos = validarCampos(dto);


        if(respostaPredio.getStatusCode() != HttpStatus.OK) return respostaPredio;
        if (respostaCampos.getStatusCode() != HttpStatus.OK) return respostaCampos;


        var predio = (Predio) respostaPredio.getBody();

        var elevador = new Elevador(
                dto.modelo(),
                predio,
                new ArrayList<>()
        );

        List<Componente> listaComponentes = cr.findAllByHePadraoTrue();
        List<Componente> listaComponentesNovoElevador = new ArrayList<>();

        for(Componente componentePadrao : listaComponentes){
            Componente componente = new Componente(
                    componentePadrao.getNome(),
                    componentePadrao.isSituacao(),
                    componentePadrao.getImagem(),
                    false,
                    elevador
            );
            listaComponentesNovoElevador.add(componente);
        }
        elevador.setComponentes(listaComponentesNovoElevador);
        er.save(elevador);

        return ResponseEntity.status(HttpStatus.CREATED).body("Elevador cadastrado com sucesso");
    }

    public ResponseEntity<?> listar(UUID idPredio){
        ResponseEntity<?> respostaPredio = validarPredio(idPredio);

        if (respostaPredio.getStatusCode() != HttpStatus.OK) return respostaPredio;

        var predio = (Predio) respostaPredio.getBody();

        List<Elevador> listaElevadores = er.findAllByPredio(predio);
        List<ElevadorSaidaDto> dtoList = new ArrayList<>();
        for(Elevador elevador : listaElevadores){
            List<ComponenteEntradaDto> listComponente = new ArrayList<>();
            for(Componente componente : elevador.getComponentes()){
                listComponente.add(new ComponenteEntradaDto(
                        componente.getNome(),
                        componente.isSituacao(),
                        componente.getImagem(),
                        componente.isHePadrao()
                        ));
            }
            dtoList.add(new ElevadorSaidaDto(elevador.getId(), elevador.getModelo(), listComponente));
        }

        return ResponseEntity.status(HttpStatus.OK).body(dtoList);
    }

    public ResponseEntity<?> buscar(UUID idPredio, String modelo){
        ResponseEntity<?> respostaPredio = validarPredio(idPredio);

        if(respostaPredio.getStatusCode() != HttpStatus.OK) return respostaPredio;

        var predio = (Predio) respostaPredio.getBody();

        List<Elevador> listaElevadores = er.findAllByModeloContainingAndPredio(modelo, predio);
        List<ElevadorSaidaDto> dtoList = new ArrayList<>();
        for(Elevador elevador : listaElevadores){
            List<ComponenteEntradaDto> listaComponente = new ArrayList<>();
            for(Componente componente : elevador.getComponentes()){
                listaComponente.add( new ComponenteEntradaDto(
                        componente.getNome(),
                        componente.isSituacao(),
                        componente.getImagem(),
                        componente.isHePadrao()
                        ));
            }
            dtoList.add(new ElevadorSaidaDto(elevador.getId(), elevador.getModelo(), listaComponente));
        }
        return ResponseEntity.status(HttpStatus.OK).body(dtoList);
    }

    public ResponseEntity<?> remover(UUID idPredio, UUID idElevador){
        ResponseEntity<?> respostaElevador = validarElevadorPredio(idPredio, idElevador);

        if(respostaElevador.getStatusCode() != HttpStatus.OK) return respostaElevador;

        var elevador = (Elevador) respostaElevador.getBody();

        er.delete(elevador);

        return ResponseEntity.status(HttpStatus.OK).body("Elevador removido com sucesso");
    }

    public ResponseEntity<?> editar(UUID idPredio, UUID idElevador, ElevadorEntradaDto dto){
        ResponseEntity<?> respostaElevador = validarElevadorPredio(idPredio, idElevador);
        ResponseEntity<?> respostaCampos = validarCampos(dto);

        if(respostaElevador.getStatusCode() !=HttpStatus.OK) return respostaElevador;
        if(respostaCampos.getStatusCode() != HttpStatus.OK) return respostaCampos;


        var elevador = (Elevador) respostaElevador.getBody();
        elevador.setModelo(dto.modelo());
        er.save(elevador);
        return ResponseEntity.status(HttpStatus.OK).body("Elevador editado com sucesso");
    }
}
