package br.com.abeel.abeel.controller.dto;

import java.util.List;
import java.util.UUID;

public record PredioSaidaDto(UUID id, String nome, String bairro, List<ElevadorEntradaDto> elevadores){
}
