package br.com.abeel.abeel.repository;

import br.com.abeel.abeel.entity.Predio;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PredioRepository extends CrudRepository<Predio, UUID> {

    @Query("SELECT p FROM Predio p WHERE p.nome = :nome AND p.bairro = :bairro")
    Optional<Predio> findByNomeAndBairro(String nome, String bairro);

    List<Predio> findByNomeContaining(String nome);

    Optional<Predio> findByNomeAndBairroAndIdNot(String nome, String bairro, UUID idPredio);


}
