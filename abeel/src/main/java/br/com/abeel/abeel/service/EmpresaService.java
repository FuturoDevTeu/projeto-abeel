package br.com.abeel.abeel.service;

import br.com.abeel.abeel.controller.dto.EmpresaEntradaDto;
import br.com.abeel.abeel.controller.dto.EmpresaSaidaDto;
import br.com.abeel.abeel.entity.Empresa;
import br.com.abeel.abeel.exception.CampoVazioException;
import br.com.abeel.abeel.exception.EmpresaNaoEncontradaException;
import br.com.abeel.abeel.repository.EmpresaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class EmpresaService {

    @Autowired
    private EmpresaRepository empresaRepository;

    private void validarCadastro(EmpresaEntradaDto dto){
        if(dto.nome().isEmpty()){
            throw new CampoVazioException("Nome está vazio");
        }
    }
    
    private void validarEditar(EmpresaEntradaDto dto){
        if(dto.nome().isEmpty()){
            throw new CampoVazioException("Nome está vazio");
        }
    }

    private Empresa buscaInternaPeloId(UUID id){
        return empresaRepository.findById(id)
                .orElseThrow(() -> new EmpresaNaoEncontradaException("Empresa não encontrada"));
    }
    
    public ResponseEntity<?> cadastrar(EmpresaEntradaDto dto) {
        validarCadastro(dto);
        Empresa empresa = new Empresa(dto.nome());
        empresaRepository.save(empresa);
        return ResponseEntity.ok().build();
    }

    public ResponseEntity<?> listarTodas() {
        List<Empresa> lista = empresaRepository.findAll();
        List<EmpresaSaidaDto> listaDto = lista.stream()
                .map(EmpresaSaidaDto::toDto)
                .toList();
        return ResponseEntity.ok().body(listaDto);
    }
    
    public ResponseEntity<?> editar(UUID empresaId, EmpresaEntradaDto dto) {
        validarEditar(dto);
        Empresa empresa = buscaInternaPeloId(empresaId);
        empresa.setNome(dto.nome());
        empresaRepository.save(empresa);
        return ResponseEntity.ok().build();
    }

    public ResponseEntity<?> deletar(UUID empresaId) {
        Empresa empresa = buscaInternaPeloId(empresaId);
        empresaRepository.delete(empresa);
        return ResponseEntity.ok().build();
    }
}
