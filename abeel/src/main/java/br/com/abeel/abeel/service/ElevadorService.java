package br.com.abeel.abeel.service;

import br.com.abeel.abeel.controller.dto.ComponenteEntradaDto;
import br.com.abeel.abeel.controller.dto.ElevadorEntradaDto;
import br.com.abeel.abeel.controller.dto.ElevadorSaidaDto;
import br.com.abeel.abeel.entity.Componente;
import br.com.abeel.abeel.entity.Elevador;
import br.com.abeel.abeel.entity.Predio;
import br.com.abeel.abeel.exception.CampoVazioException;
import br.com.abeel.abeel.exception.ElevadorNaoEncontradoException;
import br.com.abeel.abeel.exception.PredioNaoEncontradoException;
import br.com.abeel.abeel.repository.ComponenteRepository;
import br.com.abeel.abeel.repository.ElevadorRepository;
import br.com.abeel.abeel.repository.PredioRepository;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.lowagie.text.pdf.draw.LineSeparator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.*;
import java.util.List;

@Service
public class ElevadorService {

    @Autowired
    private ElevadorRepository er;

    @Autowired
    private PredioRepository pr;

    @Autowired
    private PredioService ps;

    @Autowired
    private ComponenteRepository cr;

    private Predio buscarPredio(UUID id){
        return pr.findById(id).orElseThrow(() -> new PredioNaoEncontradoException("Predio não encontrado"));
    }
    private Elevador buscarElevador(UUID id){
        return er.findById(id).orElseThrow(() -> new ElevadorNaoEncontradoException("Elevador não encontrado"));
    }

    private void validarCampos(ElevadorEntradaDto dto){
        if(dto.modelo().isEmpty()){
            throw new CampoVazioException("Modelo está vazio");
        }
    }

    public ResponseEntity<?> cadastrar(UUID idPredio, ElevadorEntradaDto dto){
        Predio predio = buscarPredio(idPredio);
        validarCampos(dto);

        var elevador = new Elevador(
                dto.modelo(),
                predio
        );

        er.save(elevador);

        List<Componente> listaComponentes = cr.findAllByHePadraoTrue();
        for(Componente componente : listaComponentes){
            Componente novoComponente = new Componente(
                    componente.getNome(),
                    componente.getSituacao(),
                    componente.getImagem(),
                    componente.getObservacao(),
                    false,
                    elevador
            );
            cr.save(novoComponente);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body("Elevador cadastrado com sucesso");
    }

    public ResponseEntity<?> listar(UUID idPredio){
        Predio predio = buscarPredio(idPredio);

        List<Elevador> listaElevadores = er.findAllByPredio(predio);
        List<ElevadorSaidaDto> dtoList = listaElevadores.stream()
                .map(ElevadorSaidaDto::paraDto)
                .toList();
        return ResponseEntity.status(HttpStatus.OK).body(dtoList);
    }

    public ResponseEntity<?> buscar(UUID idPredio, String modelo){
        Predio predio  = buscarPredio(idPredio);

        List<Elevador> listaElevadores = er.findAllByModeloContainingAndPredio(modelo, predio);
        List<ElevadorSaidaDto> dtoList = listaElevadores.stream()
                .map(ElevadorSaidaDto::paraDto)
                .toList();
        return ResponseEntity.status(HttpStatus.OK).body(dtoList);
    }

    public ResponseEntity<?> buscarPeloId(UUID idElevador){
        Elevador elevador = er.findById(idElevador)
                .orElseThrow(() -> new ElevadorNaoEncontradoException("Elevador não encontrado"));
        ElevadorSaidaDto dto = ElevadorSaidaDto.paraDto(elevador);
        return ResponseEntity.ok().body(dto);
    }

    public ResponseEntity<?> remover(UUID idElevador){
        Elevador elevador = buscarElevador(idElevador);
        er.delete(elevador);
        return ResponseEntity.status(HttpStatus.OK).body("Elevador removido com sucesso");
    }

    public ResponseEntity<?> editar(UUID idElevador, ElevadorEntradaDto dto){
        Elevador elevador = buscarElevador(idElevador);
        validarCampos(dto);
        elevador.setModelo(dto.modelo());
        er.save(elevador);
        return ResponseEntity.status(HttpStatus.OK).body("Elevador editado com sucesso");
    }
    public ResponseEntity<?> gerarRelatorio(UUID idElevador){
        Elevador elevador = buscarElevador(idElevador);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        Document document = new Document(PageSize.A4);

        PdfWriter.getInstance(document, baos);
        document.open();

        LocalDate dataAtual = LocalDate.now();
        int ano = dataAtual.getYear();
        Font fonteTitulo = FontFactory.getFont(FontFactory.TIMES_BOLD);
        Paragraph titulo = new Paragraph(
                new Chunk("RELATORIO DE INSPEÇÂO "+ ano, fonteTitulo)
        );
        titulo.setAlignment(Element.ALIGN_CENTER);
        document.add(titulo);

        LineSeparator linha = new LineSeparator();
        linha.setLineWidth(1f);
        linha.setPercentage(100f);
        linha.setAlignment(Element.ALIGN_CENTER);
        linha.setOffset(-2);
        document.add(linha);

        PdfPTable tabelaCabecalho = new PdfPTable(2);
        tabelaCabecalho.setWidthPercentage(100);
        tabelaCabecalho.setSpacingBefore(10f);
        tabelaCabecalho.setSpacingAfter(10f);


        PdfPCell celulaPredio = new PdfPCell(new Phrase("Predio: "+ elevador.getPredio().getNome()));
        celulaPredio.setBorder(Rectangle.NO_BORDER);

        PdfPCell celulaBairro = new PdfPCell(new Phrase("Bairro: "+ elevador.getPredio().getBairro()));
        celulaBairro.setBorder(Rectangle.NO_BORDER);

        tabelaCabecalho.addCell(celulaPredio);
        tabelaCabecalho.addCell(celulaBairro);

        PdfPCell celulaElevador = new PdfPCell(new Phrase("Elevador: "+ elevador.getModelo()));
        celulaElevador.setColspan(2);
        celulaElevador.setBorder(Rectangle.NO_BORDER);

        tabelaCabecalho.addCell(celulaElevador);
        document.add(tabelaCabecalho);

        PdfPTable tabelaConteudo = new PdfPTable(3);
        tabelaConteudo.setWidthPercentage(100);
        tabelaConteudo.setSpacingBefore(10f);
        tabelaConteudo.setSpacingAfter(10f);

        PdfPCell celulaNome =  new PdfPCell(new Phrase("Componente", fonteTitulo));
        celulaNome.setBackgroundColor(Color.YELLOW);
        PdfPCell celulaSituacao = new PdfPCell(new Phrase("Estado", fonteTitulo));
        celulaSituacao.setBackgroundColor(Color.YELLOW);
        PdfPCell celulaObservacao = new PdfPCell(new Phrase("Observacao", fonteTitulo));
        celulaObservacao.setBackgroundColor(Color.YELLOW);

        tabelaConteudo.addCell(celulaNome);
        tabelaConteudo.addCell(celulaSituacao);
        tabelaConteudo.addCell(celulaObservacao);

        for (Componente componente : elevador.getComponentes()){
            PdfPCell celulaNoneC = new PdfPCell(new Phrase(componente.getNome()));
            PdfPCell celulaSituacaoC = new PdfPCell(new Phrase(componente.getSituacao().getNome()));
            var obs = componente.getObservacao() == null ? "Não há observação" : componente.getObservacao();
            PdfPCell celulaObservacaoC = new PdfPCell(new Phrase(obs));
            tabelaConteudo.addCell(celulaNoneC);
            tabelaConteudo.addCell(celulaSituacaoC);
            tabelaConteudo.addCell(celulaObservacaoC);
        }
        document.add(tabelaConteudo);
        document.close();
        return ResponseEntity.status(HttpStatus.OK).body(baos.toByteArray());
    }
}