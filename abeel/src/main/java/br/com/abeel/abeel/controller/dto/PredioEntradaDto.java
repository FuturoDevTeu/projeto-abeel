package br.com.abeel.abeel.controller.dto;

import java.util.List;

public record PredioEntradaDto(String nome, String bairro, List<ElevadorEntradaDto> elevadores){
}
