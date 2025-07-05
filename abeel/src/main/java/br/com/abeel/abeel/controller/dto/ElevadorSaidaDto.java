package br.com.abeel.abeel.controller.dto;

import java.util.List;
import java.util.UUID;

public record ElevadorSaidaDto(UUID id, String modelo, List<ComponenteEntradaDto> componentes) {
}
