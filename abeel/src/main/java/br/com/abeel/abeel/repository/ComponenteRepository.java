package br.com.abeel.abeel.repository;

import br.com.abeel.abeel.entity.Componente;
import br.com.abeel.abeel.entity.Elevador;
import br.com.abeel.abeel.entity.Predio;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ComponenteRepository extends CrudRepository<Componente, UUID> {

    List<Componente> findAllByHePadraoTrue();

    List<Componente> findAllByElevador(Elevador elevador);

    List<Componente> findAllByNomeContainingAndElevador(String nome, Elevador elevador);

    List<Componente> findByNome(String nome);

    List<Componente> findByNomeAndIdNot(String nome, UUID idComponente);

    Optional<Componente> findByIdAndElevador(UUID id, Elevador elevador);

}
