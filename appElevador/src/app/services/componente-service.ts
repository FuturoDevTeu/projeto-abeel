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

  carregarComponentesDoElevador(idElevador: string): Observable<Componente[]> {
    return this.httpClient.get<Componente[]>(`${this.url}/componente/${idElevador}/listar`);
  }

  buscarComponentesDoElevador(idElevador: string, nome: string): Observable<Componente[]> {
    return this.httpClient.get<Componente[]>(`${this.url}/componente/${idElevador}/${nome}`);
  }

  cadastrarComponenteNoElevador(idElevador: string, componente: ComponenteRequest): Observable<any> {
    const formData = new FormData();
    formData.append("nome", componente.nome);

    // agora situacao é objeto -> precisa mandar os dois campos
    formData.append("situacao", componente.situacao) 
    formData.append("observacao", componente.observacao ?? '');
    formData.append("hePadrao", String(componente.hePadrao ?? false));

    if (componente.imagem) {
      formData.append("imagem", componente.imagem, componente.imagem.name);
    }

    return this.httpClient.post(
      `${this.url}/componente/${idElevador}/cadastrar`,
      formData,
      { responseType: 'text' }
    );
  }

  editarComponenteDoElevador(idElevador: string, idComponente: string, componente: ComponenteRequest): Observable<any> {
    const formData = new FormData();
    formData.append("nome", componente.nome);

    // idem no editar
    formData.append("situacao", componente.situacao) 

    formData.append("observacao", componente.observacao ?? '');
    formData.append("hePadrao", String(componente.hePadrao ?? false));

    if (componente.imagem) {
      formData.append("imagem", componente.imagem, componente.imagem.name);
    }

    return this.httpClient.put(
      `${this.url}/componente/${idComponente}`,
      formData,
      { responseType: 'text' }
    );
  }

  deletarComponenteDoElevador(idElevador: string, idComponente: string): Observable<any> {
    return this.httpClient.delete(
      `${this.url}/componente/${idComponente}`,
      { responseType: "text" }
    );
  }
}
