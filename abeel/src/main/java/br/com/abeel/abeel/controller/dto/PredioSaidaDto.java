package br.com.abeel.abeel.controller.dto;

import br.com.abeel.abeel.entity.Predio;

import java.util.List;
import java.util.UUID;

public record PredioSaidaDto(UUID id, String nome, String bairro){
    public static PredioSaidaDto toDto(Predio predio){
        return new PredioSaidaDto(
                predio.getId(),
                predio.getNome(),
                predio.getBairro()
        );
    }
}
    