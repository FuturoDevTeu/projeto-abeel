package br.com.abeel.abeel.controller.dto;

import br.com.abeel.abeel.entity.Componente;

public record ComponenteEntradaDto(String nome, boolean situacao, byte[] imagem, String observacao, boolean hePadrao) {
    public ComponenteEntradaDto(Componente componente){
        this(componente.getNome(), componente.isSituacao(), componente.getImagem(), componente.getObservacao(), componente.isHePadrao());
    }
}
