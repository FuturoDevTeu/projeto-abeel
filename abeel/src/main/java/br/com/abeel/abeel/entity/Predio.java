package br.com.abeel.abeel.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "tb_predio")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Predio {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "predio_id")
    private UUID id;

    @Column(name = "nome", nullable = false)
    private String nome;

    @Column(name = "bairro", nullable = false)
    private String bairro;

    @OneToMany(mappedBy = "predio", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Elevador> elevadores;


    public Predio(UUID id, String nome, String bairro) {
        this.id = id;
        this.nome = nome;
        this.bairro = bairro;
    }

    public Predio(String nome, String bairro){
        this.nome = nome;
        this.bairro = bairro;
    }
}
