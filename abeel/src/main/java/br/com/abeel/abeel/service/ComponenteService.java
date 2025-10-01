package br.com.abeel.abeel.service;

import br.com.abeel.abeel.controller.dto.ComponenteSaidaDto;
import br.com.abeel.abeel.controller.dto.SituacaoDto;
import br.com.abeel.abeel.entity.Componente;
import br.com.abeel.abeel.entity.Elevador;
import br.com.abeel.abeel.entity.Situacao;
import br.com.abeel.abeel.exception.*;
import br.com.abeel.abeel.repository.ComponenteRepository;
import br.com.abeel.abeel.repository.ElevadorRepository;
import br.com.abeel.abeel.repository.SituacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.lang.Nullable;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.StreamSupport;

@Service
public class ComponenteService {

    @Autowired
    private ComponenteRepository cr;

    @Autowired
    private ElevadorRepository er;

    @Autowired
    private SituacaoRepository sr;

    private Elevador buscarPeloIdElevador(UUID idElevador){
        return er.findById(idElevador).orElseThrow(() -> new ElevadorNaoEncontradoException("Elevador não encontrado"));
    }

    private Componente buscarPeloIdComponente(UUID idComponente){
        return cr.findById(idComponente).orElseThrow(() -> new ComponenteNaoEncontradoException("Componente não encontrado"));
    }
    private void validarCamposCadastrar(String nome, @Nullable MultipartFile imagem, @Nullable String observacao){
        if(nome.isEmpty()){
            throw new CampoVazioException("Nome está vazio");
        }
        Componente componente = cr.findByNome(nome);
        if(componente !=null){
            throw new ComponenteJaExisteException("Componente ja existe");
        }
        if((imagem == null || imagem.isEmpty()) && (observacao == null || observacao.isEmpty())){
            throw new CampoVazioException("É preciso ter uma imagem ou uma observação");
        }
        if(imagem != null){
            if(!imagem.getContentType().matches("^image/.*$")){
                throw new ImagemIncorretaException("Apenas imagem são permitidas");
            }
        }
    }

    private void validarCamposEditar(UUID idComponente, String nome, @Nullable MultipartFile imagem, @Nullable String observacao){
        if(nome.isEmpty()){
            throw new CampoVazioException("Nome está vazio");
        }

        if(cr.existsByNomeAndIdNot(nome, idComponente)){
            throw new ComponenteJaExisteException("Componente ja existe");
        }

        if((imagem == null || imagem.isEmpty()) && (observacao == null || observacao.isEmpty())){
            throw new CampoVazioException("É preciso ter uma imagem ou uma observação");
        }
        if(imagem != null){
            if(!imagem.getContentType().matches("^image/.*$")){
                throw new ImagemIncorretaException("Apenas imagem são permitidas");
            }
        }
    }

    private void replicarParaElevadores(Componente componentePadrao) {
        List<Elevador> elevadores = StreamSupport.stream(er.findAll().spliterator(), false)
                .toList();

        for (Elevador elevador : elevadores) {
            boolean jaExiste = elevador.getComponentes().stream()
                    .anyMatch(c -> c.getNome().equalsIgnoreCase(componentePadrao.getNome()));

            Situacao situacao = sr.findByNome(Situacao.Values.APROVADO.name());
            if (!jaExiste) {
                Componente novoComponente = new Componente(
                        componentePadrao.getNome(),
                        situacao,
                        null,
                        "",
                        false,
                        elevador
                );
                cr.save(novoComponente);
            }
        }
    }
    public ResponseEntity<?> cadastrar(
            UUID idElevador,
            String nome,
            SituacaoDto situacao,
            @Nullable MultipartFile imagem,
            String observacao,
            boolean hePadrao
        ){
        Elevador elevador = buscarPeloIdElevador(idElevador);
        validarCamposCadastrar(nome, imagem, observacao);
        byte[] imagemBytes = null;
        if (imagem != null && !imagem.isEmpty()) {
            try {
                imagemBytes = imagem.getBytes();
            } catch (IOException ex) {
                throw new ImagemIncorretaException("Erro ao processar a imagem: " + ex.getMessage());
            }
        }

        Situacao situacaoO = sr.findByNome(Situacao.Values.valueOf(situacao.name()).getRegistro());
        var componente = new Componente(
                nome,
                situacaoO,
                imagemBytes,
                observacao,
                hePadrao,
                elevador
        );
        cr.save(componente);

        if (hePadrao) {
            replicarParaElevadores(componente);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body("Componente criado com sucesso");
    }

    public ResponseEntity<?> listar(UUID idElevador){
        Elevador elevador = buscarPeloIdElevador(idElevador);
        List<Componente> listaComponentes = cr.findAllByElevador(elevador);
        for(Componente componente : listaComponentes){
            System.out.println(componente.getNome());
        }
        List<ComponenteSaidaDto> dtoList = listaComponentes.stream()
                .map(ComponenteSaidaDto::fromEntity)
                .toList();
        return ResponseEntity.status(HttpStatus.OK).body(dtoList);
    }

    public ResponseEntity<?> listarTodos(){
        List<Componente> listaComponentes = (List<Componente>) cr.findAll();
        List<ComponenteSaidaDto> dtoList = listaComponentes.stream()
                .map(ComponenteSaidaDto::fromEntity)
                .toList();
        return ResponseEntity.status(HttpStatus.OK).body(dtoList);
    }

    public ResponseEntity<?> buscar(UUID idElevador, String nome){
        Elevador elevador = buscarPeloIdElevador(idElevador);
        List<Componente> listaComponentes = cr.findAllByNomeContainingAndElevador(nome, elevador);
        List<ComponenteSaidaDto> dtoList = listaComponentes.stream()
                .map(ComponenteSaidaDto::fromEntity)
                .toList();
        return ResponseEntity.status(HttpStatus.OK).body(dtoList);
    }

    public ResponseEntity<?> remover(UUID idComponente){
        Componente componente = buscarPeloIdComponente(idComponente);
        cr.delete(componente);
        return ResponseEntity.status(HttpStatus.OK).body("Componente deletado com sucesso");
    }

    public ResponseEntity<?> editar(
            UUID idComponente,
            String nome,
            SituacaoDto situacaoDto,
            @Nullable MultipartFile imagem,
            String observacao,
            boolean hePadrao
    ){
        Componente componente = buscarPeloIdComponente(idComponente);
        validarCamposEditar(idComponente, nome, imagem, observacao);
        byte[] imagemBytes = null;
        if (imagem != null && !imagem.isEmpty()) {
            try {
                imagemBytes = imagem.getBytes();
            } catch (IOException ex) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error","Erro ao processar a imagem: " + ex.getMessage()));
            }
        }

        Situacao situacao = sr.findByNome(Situacao.Values.valueOf(situacaoDto.name()).getRegistro());
        componente.setNome(nome);
        componente.setSituacao(situacao);
        componente.setImagem(imagemBytes);
        componente.setObservacao(observacao);
        componente.setHePadrao(hePadrao);

        cr.save(componente);

        if (hePadrao) {
            replicarParaElevadores(componente);
        }

        return ResponseEntity.status(HttpStatus.OK).body("Componente editado com sucesso");
    }
}
