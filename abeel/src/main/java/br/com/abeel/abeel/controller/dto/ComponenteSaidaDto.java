package br.com.abeel.abeel.controller.dto;

import br.com.abeel.abeel.entity.Componente;
import br.com.abeel.abeel.entity.Situacao;

import java.util.Base64;
import java.util.UUID;

public record ComponenteSaidaDto(UUID id, String nome, Situacao situacao, String imagemBase64, String observacao, boolean hePadrao) {
    public static ComponenteSaidaDto fromEntity(Componente componente){
        String imagemBase64 = null;
        if(componente.getImagem() != null){
            imagemBase64 = "data:image/jpeg;base64,"+ Base64.getEncoder().encodeToString(componente.getImagem());
        }
        return new ComponenteSaidaDto(
                componente.getId(),
                componente.getNome(),
                componente.getSituacao(),
                imagemBase64,
                componente.getObservacao(),
                componente.isHePadrao()
        );
    }
}
