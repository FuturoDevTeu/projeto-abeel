package br.com.abeel.abeel.controller.dto;

import br.com.abeel.abeel.entity.Situacao;
import br.com.abeel.abeel.exception.CampoVazioException;

public enum SituacaoDto {
    APROVADO,
    REPROVADO,
    SIM,
    NAO,
    NAO_SE_APLICA;
    public static SituacaoDto fromEntity(Situacao situacao){
        System.out.println(situacao.getNome());
        return switch (situacao.getNome().toUpperCase()){
            case "APROVADO" -> APROVADO;
            case "REPROVADO" -> REPROVADO;
            case "SIM" -> SIM;
            case "NAO", "NÃO" -> NAO;
            case "NÃO SE APLICA", "NAO SE APLICA" -> NAO_SE_APLICA;
            default -> throw new CampoVazioException("Situacao não encontrado: "+ situacao.getNome());
        };
    }
}
