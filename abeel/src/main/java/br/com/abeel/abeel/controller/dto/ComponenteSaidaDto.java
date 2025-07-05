package br.com.abeel.abeel.controller.dto;

import br.com.abeel.abeel.entity.Componente;

import java.util.Base64;

public record ComponenteSaidaDto(String nome, boolean situacao, String imagemBase64, boolean hePadrao) {
    public static ComponenteSaidaDto fromEntity(Componente componente){
        String imagemBase64 = null;
        if(componente.getImagem() != null){
            imagemBase64 = "data:image/jpeg;base64,"+ Base64.getEncoder().encodeToString(componente.getImagem());
        }

        return new ComponenteSaidaDto(
                componente.getNome(),
                componente.isSituacao(),
                imagemBase64,
                componente.isHePadrao()
        );
    }
}
