package br.com.abeel.abeel.controller.dto;


import java.util.List;

public record ElevadorEntradaDto(String modelo, List<ComponenteEntradaDto> componentes){
    public static ElevadorEntradaDto somenteModelo(String modelo){
        return new ElevadorEntradaDto(modelo, List.of());
    }
}
