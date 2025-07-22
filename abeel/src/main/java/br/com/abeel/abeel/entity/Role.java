package br.com.abeel.abeel.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "tb_role")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id")
    private long id;

    private String nome;

    public enum Values{
        ADMIN(1L);

        private long id;

        Values(long id){
            this.id = id;
        }
        public long getId(){
            return this.id;
        }

    }
}
