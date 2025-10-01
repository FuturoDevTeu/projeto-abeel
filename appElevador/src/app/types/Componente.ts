export interface Componente {
  id: string;
  nome: string;
  situacao: 'APROVADO' | 'REPROVADO' | 'SIM' | 'NAO' | 'NAO_SE_APLICA';
  imagemBase64?: string;
  observacao?: string;
  hePadrao: boolean;
}
