package br.com.abeel.abeel.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
    @Column(name = "predio_id", columnDefinition = "BINARY(16)")
    private UUID id;

    @Column(name = "nome", nullable = false)
    private String nome;

    @Column(name = "bairro", nullable = false)
    private String bairro;

    @OneToMany(mappedBy = "predio", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Elevador> elevadores;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "empresa_id")
    private Empresa empresa;


    public Predio(String nome, String bairro, Empresa empresa){
        this.nome = nome;
        this.bairro = bairro;
        this.empresa = empresa;
    }
}
