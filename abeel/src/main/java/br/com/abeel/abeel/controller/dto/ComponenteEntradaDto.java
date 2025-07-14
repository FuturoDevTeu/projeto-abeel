package br.com.abeel.abeel.controller.dto;

public record ComponenteEntradaDto(String nome, boolean situacao, byte[] imagem, String observacao, boolean hePadrao) {
}
