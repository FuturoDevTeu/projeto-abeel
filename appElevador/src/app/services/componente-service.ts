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
    return this.httpClient.get<Componente[]>(this.url+"/"+idElevador+"/listar");
  }
  
  buscarComponentesDoElevador(idElevador: string, nome: string): Observable<Componente[]>{
    return this.httpClient.get<Componente[]>(this.url+"/"+idElevador+"/"+nome);
  }

  cadastrarComponenteNoElevador(idElevador: string, componente: ComponenteRequest): Observable<string>{
    return this.httpClient.post<string>(this.url+"/"+idElevador,componente);
  }

  deletarComponenteDoElevador(idElevador: string, idComponente: string): Observable<string>{
    return this.httpClient.delete<string>(this.url+"/"+idElevador+"/"+idComponente);
  }

  editarComponenteDoElevador(idElevador: string, idComponente: string, componente: ComponenteRequest): Observable<string>{
    this.httpClient.put<string>(this.url+"/"+idElevador+"/"+idComponente, componente);
  }
}
