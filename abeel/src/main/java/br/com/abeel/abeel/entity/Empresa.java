package br.com.abeel.abeel.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "tb_empresa")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Empresa {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "empresa_id")
    private UUID id;

    @Column(name = "nome")
    private String nome;

    @OneToMany(mappedBy = "empresa", orphanRemoval = true, cascade = CascadeType.ALL)
    @Column(name = "predios")
    private List<Predio> predios;

    public Empresa(String nome) {
        this.nome = nome;
    }
}
