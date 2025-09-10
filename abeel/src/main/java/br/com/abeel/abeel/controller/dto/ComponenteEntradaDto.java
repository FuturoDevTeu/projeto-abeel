package br.com.abeel.abeel.controller.dto;

public record ComponenteEntradaDto(String nome, SituacaoDto situacao, byte[] imagem, String observacao, boolean hePadrao) {
}
