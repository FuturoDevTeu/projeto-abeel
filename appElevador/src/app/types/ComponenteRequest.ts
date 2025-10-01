export interface ComponenteRequest {
  nome: string;
  situacao: 'APROVADO' | 'REPROVADO' | 'SIM' | 'NAO' | 'NAO_SE_APLICA';
  imagem?: File;
  observacao?: string;
  hePadrao?: boolean;
}
