package br.com.abeel.abeel.controller.dto;

import br.com.abeel.abeel.entity.Elevador;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public record ElevadorSaidaDto(UUID id, String modelo, List<ComponenteEntradaDto> componentes, UUID predioId) {
    public ElevadorSaidaDto(Elevador elevador){
        this(
                elevador.getId(),
                elevador.getModelo(),
                elevador.getComponentes() == null ? List.of() :
                        elevador.getComponentes().stream()
                                .map(ComponenteEntradaDto::new)
                                .collect(Collectors.toList()),
                elevador.getPredio().getId()
        );
    }
}
