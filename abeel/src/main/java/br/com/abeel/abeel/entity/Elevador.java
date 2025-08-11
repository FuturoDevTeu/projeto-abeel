package br.com.abeel.abeel.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.action.internal.OrphanRemovalAction;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "tb_elevador")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Elevador {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "elevador_id", columnDefinition = "BINARY(16)")
    private UUID id;

    @Column(name = "modelo", nullable = false)
    private String modelo;

    @ManyToOne
    @JoinColumn(name = "predio_id")
    private Predio predio;

    @OneToMany(mappedBy = "elevador", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("componentes")
    private List<Componente> componentes;

    public Elevador(String modelo, Predio predio, List<Componente> componentes) {
        this.modelo = modelo;
        this.predio = predio;
        this.componentes = componentes;
    }

    public Elevador(UUID id, String modelo) {
        this.id = id;
        this.modelo = modelo;
    }
}
