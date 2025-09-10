package br.com.abeel.abeel.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tb_situacao")
@Setter
@Getter
public class Situacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "situacao_id")
    private long id;

    @Column(name = "nome", nullable = false, unique = true)
    private String nome;

    @OneToOne(mappedBy = "situacao")
    private Componente componente;

    @Getter
    public enum Values{
        APROVADO(1L, "Aprovado"),
        REPROVADO(2L, "Reprovado"),
        SIM(3L, "Sim"),
        NAO(4L, "Não"),
        NAO_SE_APLICA(5L, "Não se aplica");

        private final long id;
        private final String registro;

        Values(long id, String registro){
            this.id = id;
            this.registro = registro;
        }

    }



}
