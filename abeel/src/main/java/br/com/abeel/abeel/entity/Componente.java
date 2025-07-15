package br.com.abeel.abeel.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Entity
@Table(name = "tb_componente")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Componente {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "nome", nullable = false)
    private String nome;

    @Column(name = "situacao", nullable = false)
    private boolean situacao;

    @Lob
    @Column(name = "imagem", nullable = true, columnDefinition = "LONGBLOB")
    private byte[] imagem;

    @Column(name = "observacao")
    private String observacao;

    @Column(name = "peca_padrao")
    private boolean hePadrao;

    @ManyToOne
    @JoinColumn(name = "elevador_id")
    private Elevador elevador;

    public Componente(String nome, boolean situacao, byte[] imagem, String observacao, boolean hePadrao, Elevador elevador) {
        this.nome = nome;
        this.situacao = situacao;
        this.imagem = imagem;
        this.observacao = observacao;
        this.hePadrao = hePadrao;
        this.elevador = elevador;
    }
}
