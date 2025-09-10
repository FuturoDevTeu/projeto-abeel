package br.com.abeel.abeel.controller.dto;

import br.com.abeel.abeel.entity.Componente;
import br.com.abeel.abeel.entity.Elevador;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public record ElevadorSaidaDto(UUID id, String modelo, List<UUID> componentes) {
    public static ElevadorSaidaDto paraDto(Elevador elevador){

        List<UUID> idsComponente = elevador.getComponentes().stream()
                .map(Componente::getId)
                .toList();

        return new ElevadorSaidaDto(
                elevador.getId(),
                elevador.getModelo(),
                idsComponente
        );
    }

}
