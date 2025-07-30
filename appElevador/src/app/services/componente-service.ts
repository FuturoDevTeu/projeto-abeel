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

    cadastrarComponenteNoElevador(idElevador: string, componente: ComponenteRequest): Observable<string>{
      const formData = new FormData();

      formData.append("nome", componente.nome);
      formData.append("situacao", String(componente.situacao ?? false));
      formData.append("observacao", String(componente.observacao ?? ''));
      formData.append("hePadrao", String(componente.hePadrao ?? false));

      if(componente.imagem){
        formData.append('imagem', componente.imagem, componente.imagem.name);
      }
      return this.httpClient.post<string>(this.url+"/componente/"+idElevador+"/cadastrar", formData);   
    }

    deletarComponenteDoElevador(idElevador: string, idComponente: string): Observable<string>{
      return this.httpClient.delete<string>(this.url+"/componente/"+idElevador+"/"+idComponente);
    }

    editarComponenteDoElevador(idElevador: string, idComponente: string, componente: ComponenteRequest): Observable<string>{
      return this.httpClient.put<string>(this.url+"/componente/"+idElevador+"/"+idComponente, componente);
    }
  }
