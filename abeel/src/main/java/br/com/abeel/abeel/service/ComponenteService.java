package br.com.abeel.abeel.service;

import br.com.abeel.abeel.controller.dto.ComponenteSaidaDto;
import br.com.abeel.abeel.entity.Componente;
import br.com.abeel.abeel.entity.Elevador;
import br.com.abeel.abeel.repository.ComponenteRepository;
import br.com.abeel.abeel.repository.ElevadorRepository;
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
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class ComponenteService {

    @Autowired
    private ComponenteRepository cr;

    @Autowired
    private ElevadorRepository er;


    private ResponseEntity<?> validarElevador(UUID idElevador){
        Optional<Elevador> elevadorOptional = er.findById(idElevador);

        if(elevadorOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error","Elevador não encontrado"));
        }

        return ResponseEntity.status(HttpStatus.OK).body(elevadorOptional.get());
    }
    private ResponseEntity<?> validarCamposCadastro(String nome, @Nullable MultipartFile imagem, @Nullable String observacao){
        if (nome == null || nome.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error","Nome está em branco"));
        }
        if (!nome.matches("^[\\p{L} ]{3,}$")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error","Nome inválido (mínimo 3 caracteres alfabéticos)"));
        }

        if (!cr.findByNome(nome).isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error","Esse componente já existe"));
        }

        if(imagem != null && !imagem.isEmpty()){
            if(!imagem.getContentType().matches("^image/.*$")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Formato de imagem inválido. Apenas imagens são permitidas."));
            }
        }

        return ResponseEntity.ok().build();
    }
    private ResponseEntity<?> validarCamposEditar(String nome, @Nullable MultipartFile imagem, @Nullable String observacao, UUID idComponente){
        if (nome == null || nome.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error","Nome está em branco"));
        }
        if (!nome.matches("^[\\p{L} -]{3,}$")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error","Nome inválido (mínimo 3 caracteres alfabéticos)"));
        }

        if (cr.findByNomeAndIdNot(nome, idComponente).isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error","Esse componente já existe"));
        }

        if(imagem != null && !imagem.isEmpty()){
            if(!imagem.getContentType().matches("^image/.*$")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Formato de imagem inválido. Apenas imagens são permitidas."));
            }
        }

        return ResponseEntity.ok().build();
    }

    private ResponseEntity<?> validarComponenteElevador(UUID idComponente, UUID idElevador){
        ResponseEntity<?> respostaElevador = validarElevador(idElevador);

        if(respostaElevador.getStatusCode() != HttpStatus.OK) {
            return respostaElevador;
        }

        Elevador elevador = (Elevador) respostaElevador.getBody();
        Optional<Componente> componenteOptional = cr.findByIdAndElevador(idComponente, elevador);

        if(componenteOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error","Componente não encontrado para o elevador especificado"));
        }

        return ResponseEntity.status(HttpStatus.OK).body(componenteOptional.get());
    }

    private void replicarParaElevadores(Componente componentePadrao) {
        List<Elevador> elevadores = StreamSupport.stream(er.findAll().spliterator(), false)
                .collect(Collectors.toList());

        for (Elevador elevador : elevadores) {
            boolean jaExiste = elevador.getComponentes().stream()
                    .anyMatch(c -> c.getNome().equalsIgnoreCase(componentePadrao.getNome()));

            if (!jaExiste) {
                Componente novoComponente = new Componente(
                        componentePadrao.getNome(),
                        true,
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
            boolean situacao,
            @Nullable MultipartFile imagem,
            String observacao,
            boolean hePadrao
        ){
        ResponseEntity<?> respostaElevador = validarElevador(idElevador);
        if(respostaElevador.getStatusCode() != HttpStatus.OK) {
            return respostaElevador;
        }
        Elevador elevador = (Elevador) respostaElevador.getBody();

        ResponseEntity<?> respostaCampos = validarCamposCadastro(nome, imagem, observacao);
        if(respostaCampos.getStatusCode() != HttpStatus.OK) {
            return respostaCampos;
        }

        byte[] imagemBytes = null;
        if (imagem != null && !imagem.isEmpty()) {
            try {
                imagemBytes = imagem.getBytes();
            } catch (IOException ex) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error","Erro ao processar a imagem: " + ex.getMessage()));
            }
        }

        var componente = new Componente(
                nome,
                situacao,
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
        ResponseEntity<?> respostaElevador = validarElevador(idElevador);

        if (respostaElevador.getStatusCode() != HttpStatus.OK) {
            return respostaElevador;
        }

        Elevador elevador = (Elevador) respostaElevador.getBody();

        List<Componente> listaComponentes = cr.findAllByElevador(elevador);
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
        ResponseEntity<?> respostaElevador = validarElevador(idElevador);

        if (respostaElevador.getStatusCode() != HttpStatus.OK) {
            return respostaElevador;
        }

        Elevador elevador = (Elevador) respostaElevador.getBody();

        List<Componente> listaComponentes = cr.findAllByNomeContainingAndElevador(nome, elevador);

        List<ComponenteSaidaDto> dtoList = listaComponentes.stream()
                .map(ComponenteSaidaDto::fromEntity)
                .toList();
        return ResponseEntity.status(HttpStatus.OK).body(dtoList);
    }

    public ResponseEntity<?> remover(UUID idElevador, UUID idComponente){
        ResponseEntity<?> respostaComponente = validarComponenteElevador(idComponente, idElevador);

        if(respostaComponente.getStatusCode() != HttpStatus.OK) {
            return respostaComponente;
        }

        Componente componente = (Componente) respostaComponente.getBody();

        cr.delete(componente);
        return ResponseEntity.status(HttpStatus.OK).body("Componente deletado com sucesso");
    }

    public ResponseEntity<?> editar(
            UUID idElevador,
            UUID idComponente,
            String nome,
            boolean situacao,
            @Nullable MultipartFile imagem,
            String observacao,
            boolean hePadrao
    ){
        ResponseEntity<?> respostaComponente = validarComponenteElevador(idComponente, idElevador);
        ResponseEntity<?> respostaCampos = validarCamposEditar(nome, imagem, observacao, idComponente);


        if(respostaComponente.getStatusCode() != HttpStatus.OK) {
            return respostaComponente;
        }
        if(respostaCampos.getStatusCode() != HttpStatus.OK) {
            return respostaCampos;
        }
        byte[] imagemBytes = null;
        if (imagem != null && !imagem.isEmpty()) {
            try {
                imagemBytes = imagem.getBytes();
            } catch (IOException ex) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error","Erro ao processar a imagem: " + ex.getMessage()));
            }
        }

        Componente componente = (Componente) respostaComponente.getBody();

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