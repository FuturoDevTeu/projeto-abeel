package br.com.abeel.abeel.repository;

import br.com.abeel.abeel.entity.Elevador;
import br.com.abeel.abeel.entity.Predio;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ElevadorRepository extends CrudRepository<Elevador, UUID> {

    List<Elevador> findAllByPredio(Predio predio);

    List<Elevador> findAllByModeloContainingAndPredio(String modelo, Predio Predio);

    Optional<Elevador> findByIdAndPredio(UUID id, Predio predio);

    Optional<Elevador> findByModeloAndIdNot(String modelo, UUID idElevador);

    @Query(value = "SELECT * FROM tb_elevador WHERE elevador_id = :id", nativeQuery = true)
    Optional<Elevador> findByIdBinary(@Param("id") byte[] id);
}
