import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Componente } from '../types/Componente';
import { ComponenteRequest } from '../types/ComponenteRequest';

@Injectable({
  providedIn: 'root'
})

export class ComponenteService {

  private url = environment.api;

  constructor(private httpClient: HttpClient) {}

  carregarComponentesDoElevador(idElevador: string): Observable<Componente[]>{
    return this.httpClient.get<Componente[]>(this.url+"/componente/"+idElevador+"/listar");
  }
  
  buscarComponentesDoElevador(idElevador: string, nome: string): Observable<Componente[]>{
    return this.httpClient.get<Componente[]>(this.url+"/componente/"+idElevador+"/"+nome);
  }

  // MÉTODO DE CADASTRO (Mantido, já estava usando FormData corretamente)
  cadastrarComponenteNoElevador(idElevador: string, componente: ComponenteRequest): Observable<any>{
    const formData = new FormData();

    formData.append("nome", componente.nome);
    formData.append("situacao", String(componente.situacao ?? false));
    formData.append("observacao", String(componente.observacao ?? ''));
    formData.append("hePadrao", String(componente.hePadrao ?? false));

    if(componente.imagem){
      formData.append('imagem', componente.imagem, componente.imagem.name);
    } else {
        // Se a imagem não for fornecida, mas o backend espera o campo, envie um Blob vazio.
        // Isso é uma solução paliativa. O ideal é que o backend aceite o campo 'imagem' como opcional.
        formData.append('imagem', new Blob([''], { type: 'application/octet-stream' }), '');
    }

    return this.httpClient.post(this.url+"/componente/"+idElevador+"/cadastrar", formData, {responseType: 'text'});   
  }

  // NOVO MÉTODO: Deletar Componente (Mantido, já estava OK)
  deletarComponenteDoElevador(idElevador: string, idComponente: string): Observable<any>{
    return this.httpClient.delete(this.url+"/componente/"+idElevador+"/"+idComponente, {responseType: "text"});
  }

  // MÉTODO DE EDIÇÃO (CORRIGIDO PARA USAR FormData)
  editarComponenteDoElevador(idElevador: string, idComponente: string, componente: ComponenteRequest): Observable<any>{
    const formData = new FormData();

    formData.append("nome", componente.nome);
    formData.append("situacao", String(componente.situacao ?? false));
    formData.append("observacao", String(componente.observacao ?? ''));
    formData.append("hePadrao", String(componente.hePadrao ?? false));

    // Apenas adicione a imagem ao FormData se uma NOVA imagem foi selecionada
    if(componente.imagem){
      formData.append('imagem', componente.imagem, componente.imagem.name);
    } else {
        // Se nenhuma nova imagem for selecionada, envie um Blob vazio.
        // O backend deve ser inteligente o suficiente para:
        // 1. Manter a imagem existente se este campo for vazio ou ausente.
        // 2. Remover a imagem se um sinal explícito for dado (ex: um checkbox "remover imagem").
        // No momento, enviar um Blob vazio é a forma de não enviar um novo arquivo.
        formData.append('imagem', new Blob([''], { type: 'application/octet-stream' }), '');
    }
    
    // A chamada PUT agora envia FormData, o que exige que o backend aceite MultipartFile para este endpoint.
    return this.httpClient.put(this.url+"/componente/"+idElevador+"/"+idComponente, formData, {responseType: 'text'});
  }
}