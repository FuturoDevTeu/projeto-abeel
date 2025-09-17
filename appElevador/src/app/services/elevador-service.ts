import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Elevador } from '../types/Elevador';
import { ElevadorRequest } from '../types/ElevadorRequest';


@Injectable({
  providedIn: 'root'
})
export class ElevadorService {

  private url = environment.api

  constructor(private httpClient: HttpClient) { }

  carregarElevadoresDoPredio(idPredio: string): Observable<Elevador[]>{
    return this.httpClient.get<Elevador[]>(this.url + '/elevador/'+idPredio+'/listar');
  }

  cadastrarElevadorNoPredio(idPredio: string, elevador: ElevadorRequest): Observable<any>{
    return this.httpClient.post(this.url+"/elevador/"+idPredio+"/cadastrar", elevador, {responseType: 'text'});
  }  

  buscarElevadorDoPredio(idPredio: string, modelo: string): Observable<Elevador[]>{
    return this.httpClient.get<Elevador[]>(this.url+"/elevador/"+idPredio+"/"+modelo);
  }

  buscarId(idElevador: string): Observable<Elevador>{
    return this.httpClient.get<Elevador>(this.url+"/elevador/"+idElevador+"/buscar");
  }

  removerElevadorDoPredio(idPredio: string, idElevador: string): Observable<any>{
    return this.httpClient.delete(this.url+"/elevador/"+idPredio+"/"+idElevador, { responseType: 'text'});
  }

  editarElevadorDoPredio(idPredio: string, idElevador: string, elevador: ElevadorRequest): Observable<any>{
    return this.httpClient.put(this.url+"/elevador/"+idPredio+"/"+idElevador, elevador, { responseType: 'text'});
  }

  gerarRelatorio(idElevador: string): Observable<Blob>{
    return this.httpClient.get(this.url+"/elevador/"+idElevador+"/relatorio",{ responseType: 'blob' });
  }
}