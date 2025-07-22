package br.com.abeel.abeel.repository;

import br.com.abeel.abeel.entity.Role;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoleRepository extends CrudRepository<Role, UUID> {
    Role findByNome(String nome);
}
