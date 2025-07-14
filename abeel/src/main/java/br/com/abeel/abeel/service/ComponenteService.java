package br.com.abeel.abeel.service;

import br.com.abeel.abeel.controller.dto.ComponenteEntradaDto;
import br.com.abeel.abeel.controller.dto.ComponenteSaidaDto;
import br.com.abeel.abeel.entity.Componente;
import br.com.abeel.abeel.entity.Elevador;
import br.com.abeel.abeel.repository.ComponenteRepository;
import br.com.abeel.abeel.repository.ElevadorRepository;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
public class ComponenteService {

    @Autowired
    private ComponenteRepository cr;

    @Autowired
    private ElevadorRepository er;


    private ResponseEntity<?> validarCampos(UUID idComponente, ComponenteEntradaDto dto, String acao){
        if(dto.nome() == null || dto.nome().trim().isEmpty()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Nome está em branco");

        if(!dto.nome().matches("^[\\p{L} ]{3,}$")) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Nome inválido");

        if(acao.equals("cadastrar")){
            if(cr.findByNome(dto.nome()).isPresent()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Esse componente já existe");
        }

        if(acao.equals("editar")){
            if (cr.findByNomeAndIdNot(dto.nome(), idComponente).isPresent()) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Já existe um componente com esse nome");
        }

        return ResponseEntity.status(HttpStatus.OK).build();
    }
    private ResponseEntity<?> validarCampos(String nome, MultipartFile imagem){

        if (nome == null || nome.trim().isEmpty())
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Nome está em branco");
        if (!nome.matches("^[\\p{L} ]{3,}$"))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Nome está inválido");
        if (cr.findByNome(nome).isPresent())
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Esse componente já existe");
        if(!nome.matches("^[\\p{L} ]{3,}$"))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Observacao está invalida");
        if(!imagem.getContentType().matches("^image/.*$"))
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Imagem está invalida");

        byte[] imagemByte = null;
        try{
            imagemByte = imagem.getBytes();
            return ResponseEntity.status(HttpStatus.OK).body(imagemByte);
        }catch(IOException ex){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao ler a imagem");
        }
    }

    private ResponseEntity<?> validarElevador(UUID idElevador){
        var elevadorOptional = er.findById(idElevador);

        if(elevadorOptional.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Elevador não encontrado");

        return ResponseEntity.status(HttpStatus.OK).body(elevadorOptional.get());
    }
    private ResponseEntity<?> validarComponenteElevador(UUID idComponente, UUID idElevador){
        var elevadorOptional = er.findById(idElevador);

        if(elevadorOptional.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Elevador não encontrado");

        var componenteOptional = cr.findByIdAndElevador(idComponente,elevadorOptional.get());
        if(componenteOptional.isEmpty()) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Componemte não encontrado");

        return  ResponseEntity.status(HttpStatus.OK).body(componenteOptional.get());
    }

    public ResponseEntity<?> cadastrar(
            UUID idElevador,
            String nome,
            boolean situacao,
            MultipartFile imagem,
            String observacao,
            boolean hePadrao
        ){
        ResponseEntity<?> respostaElevador = validarElevador(idElevador);
        ResponseEntity<?> respostaCampos = validarCampos(nome, imagem);

        if(respostaElevador.getStatusCode() != HttpStatus.OK) return respostaElevador;
        if(respostaCampos.getStatusCode() != HttpStatus.OK) return respostaCampos;

        var elevador = (Elevador) respostaElevador.getBody();

        var imagemBytes = (byte[]) respostaCampos.getBody();

        var componente = new Componente(
                nome,
                situacao,
                imagemBytes,
                observacao,
                hePadrao,
                elevador
        );

        cr.save(componente);
        return ResponseEntity.status(HttpStatus.CREATED).body("Componente criado com sucesso");
    }

    public ResponseEntity<?> listar(UUID idElevador){
        ResponseEntity<?> respostaElevador = validarElevador(idElevador);

        if (respostaElevador.getStatusCode() != HttpStatus.OK) return respostaElevador;

        var elevador = (Elevador) respostaElevador.getBody();

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

        if (respostaElevador.getStatusCode() != HttpStatus.OK) return respostaElevador;

        var elevador = (Elevador) respostaElevador.getBody();

        List<Componente> listaComponentes = cr.findAllByNomeContainingAndElevador(nome, elevador);

        List<ComponenteSaidaDto> dtoList = listaComponentes.stream()
                .map(ComponenteSaidaDto::fromEntity)
                .toList();
        return ResponseEntity.status(HttpStatus.OK).body(dtoList);
    }

    public ResponseEntity<?> remover(UUID idElevador, UUID idComponente){
        ResponseEntity<?> respostaComponente = validarComponenteElevador(idComponente, idElevador);

        if(respostaComponente.getStatusCode() != HttpStatus.OK) return respostaComponente;

        var componente = (Componente) respostaComponente.getBody();

        cr.delete(componente);
        return ResponseEntity.status(HttpStatus.OK).body("Componente deletado com sucesso");
    }

    public ResponseEntity<?> editar(UUID idElevador, UUID idComponente, ComponenteEntradaDto dto){
        ResponseEntity<?> respostaComponente = validarComponenteElevador(idComponente, idElevador);
        ResponseEntity<?> respostaCampos = validarCampos(idComponente, dto, "editar");

        if(respostaComponente.getStatusCode() != HttpStatus.OK) return respostaComponente;
        if(respostaCampos.getStatusCode() != HttpStatus.OK) return respostaCampos;

        var componente = (Componente) respostaComponente.getBody();

        componente.setNome(dto.nome());
        componente.setSituacao(dto.situacao());
        componente.setImagem(dto.imagem());
        componente.setObservacao(dto.observacao());
        componente.setHePadrao(dto.hePadrao());

        cr.save(componente);
        return ResponseEntity.status(HttpStatus.OK).body("Componente editado com sucesso");
    }
}
