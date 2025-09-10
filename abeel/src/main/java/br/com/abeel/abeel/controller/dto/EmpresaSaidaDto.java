package br.com.abeel.abeel.controller.dto;

import br.com.abeel.abeel.entity.Empresa;

import java.util.UUID;

public record EmpresaSaidaDto(UUID id, String nome) {
    public static EmpresaSaidaDto toDto(Empresa empresa){
        return new EmpresaSaidaDto(
                empresa.getId(),
                empresa.getNome()
        );
    }
}
