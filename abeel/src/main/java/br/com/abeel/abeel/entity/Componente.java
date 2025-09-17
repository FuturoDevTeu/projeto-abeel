package br.com.abeel.abeel.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
    @Column(name = "componente_id", columnDefinition = "BINARY(16)")
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "nome", nullable = false)
    private String nome;

    @ManyToOne
    @JoinColumn(name = "situacao_id")
    private Situacao situacao;

    @Lob
    @Column(name = "imagem", columnDefinition = "LONGBLOB")
    private byte[] imagem;

    @Column(name = "observacao")
    private String observacao;

    @Column(name = "peca_padrao")
    private boolean hePadrao;

    @ManyToOne
    @JoinColumn(name = "elevador_id")
    private Elevador elevador;

    public Componente(String nome, Situacao situacao, byte[] imagem, String observacao, boolean hePadrao, Elevador elevador) {
        this.nome = nome;
        this.situacao = situacao;
        this.imagem = imagem;
        this.observacao = observacao;
        this.hePadrao = hePadrao;
        this.elevador = elevador;
    }
}
