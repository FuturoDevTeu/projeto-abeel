package br.com.abeel.abeel.service;

import br.com.abeel.abeel.controller.dto.ElevadorEntradaDto;
import br.com.abeel.abeel.controller.dto.PredioEntradaDto;
import br.com.abeel.abeel.controller.dto.PredioSaidaDto;
import br.com.abeel.abeel.entity.Elevador;
import br.com.abeel.abeel.entity.Empresa;
import br.com.abeel.abeel.entity.Predio;
import br.com.abeel.abeel.exception.*;
import br.com.abeel.abeel.repository.EmpresaRepository;
import br.com.abeel.abeel.repository.PredioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PredioService {
    @Autowired
    private PredioRepository pr;

    @Autowired
    private EmpresaRepository er;

    private void validarCadastro(PredioEntradaDto dto){
        if(dto.nome().isEmpty()){
            throw new CampoVazioException("Nome está vazio");
        }
        if(dto.bairro().isEmpty()){
            throw new CampoVazioException("Bairro está vazio");
        }
        if(dto.idEmpresa() == null){
            throw new CampoVazioException("Empresa está vazia");
        }
        if(pr.findByNomeAndBairro(dto.nome(), dto.bairro()).isPresent()){
            throw new PredioJaExisteException("Predio já existe");
        };
    }

    private void validarEditar(PredioEntradaDto dto, UUID idPredio){
        if(dto.nome().isEmpty()){
            throw new CampoVazioException("Nome está vazio");
        }
        if(dto.bairro().isEmpty()){
            throw new CampoVazioException("Bairro está vazio");
        }
        if(dto.idEmpresa() != null){
            throw new CampoVazioException("Empresa está vazio");
        }
        if(pr.findByNomeAndBairroAndIdNot(dto.nome(), dto.bairro(), idPredio).isPresent()){
            throw new PredioJaExisteException("Predio já existe");
        }
    }

    private Empresa buscarPeloIdEmpresa(UUID id){
        return er.findById(id).orElseThrow(() -> new EmpresaNaoEncontradaException("Empresa não encontrada"));
    }

    private Predio buscarPeloIdPredio(UUID id){
        return pr.findById(id).orElseThrow(() -> new PredioNaoEncontradoException("Predio não encontrado"));
    }


    public ResponseEntity<?> cadastrar(PredioEntradaDto dto){
        System.out.println(dto.nome());
        System.out.println(dto.bairro());
        System.out.println(dto.idEmpresa());
        validarCadastro(dto);

        Empresa empresa = buscarPeloIdEmpresa(dto.idEmpresa());
        var predio = new Predio(
                dto.nome(),
                dto.bairro(),
                empresa
        );
        pr.save(predio);
        return ResponseEntity.status(HttpStatus.CREATED).body("Prédio criado com sucesso");
    }

    public ResponseEntity<?> listar(UUID idEmpresa){
        List<Predio> lista = pr.findByEmpresaId(idEmpresa);
        List<PredioSaidaDto> dtoList = lista.stream()
                .map(PredioSaidaDto::toDto)
                .toList();
        return ResponseEntity.status(HttpStatus.OK).body(dtoList);
    }

    public ResponseEntity<?> buscar(String nome){
        List<Predio> lista = pr.findByNomeContaining(nome);
        List<PredioSaidaDto> dtoList = lista.stream()
                .map(PredioSaidaDto::toDto)
                .toList();
        return ResponseEntity.status(HttpStatus.OK).body(dtoList);
    }

    public ResponseEntity<?> remover(UUID idPredio){
        Predio predio = buscarPeloIdPredio(idPredio);
        pr.delete(predio);
        return ResponseEntity.status(HttpStatus.OK).body("Prédio removido com sucesso");
    }

    public ResponseEntity<?> editar(PredioEntradaDto dto, UUID idPredio){
        Predio predio = buscarPeloIdPredio(idPredio);
        validarEditar(dto, idPredio);

        predio.setBairro(dto.bairro());
        predio.setNome(dto.nome());
        Empresa empresaEncontrado = buscarPeloIdEmpresa(dto.idEmpresa());
        predio.setEmpresa(empresaEncontrado);

        pr.save(predio);
        return ResponseEntity.status(HttpStatus.OK).body("Prédio alterado com sucesso");
    }
}
