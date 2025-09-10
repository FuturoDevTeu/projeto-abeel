package br.com.abeel.abeel.repository;

import br.com.abeel.abeel.entity.Situacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SituacaoRepository extends JpaRepository<Situacao, Long>{
    Situacao findByNome(String nome);
}
