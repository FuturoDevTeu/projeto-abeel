/**
 * @fileoverview Funções para fornecer parâmetros para pré-renderização.
 * Em um cenário real, estas funções fariam uma chamada assíncrona para
 * uma API ou banco de dados para buscar a lista completa de IDs.
 */

/**
 * Retorna uma lista de parâmetros para pré-renderizar as páginas de elevadores.
 * @returns Um array de objetos, onde cada objeto contém o `id` de um elevador.
 */
export function getElevadorPrerenderParams() {
  // Exemplo de dados estáticos para demonstração.
  // Substitua por dados reais de uma API ou serviço.
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' }
  ];
}

/**
 * Retorna uma lista de parâmetros para pré-renderizar as páginas de componentes.
 * @returns Um array de objetos, onde cada objeto contém o `id` de um componente.
 */
export function getComponentePrerenderParams() {
  // Exemplo de dados estáticos para demonstração.
  // Substitua por dados reais de uma API ou serviço.
  return [
    { id: 'a' },
    { id: 'b' },
    { id: 'c' }
  ];
}
