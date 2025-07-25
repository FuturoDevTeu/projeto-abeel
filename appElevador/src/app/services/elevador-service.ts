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

  cadastrarElevadorNoPredio(idPredio: string, elevador: ElevadorRequest): Observable<string>{
    return this.httpClient.post<string>(this.url+"/"+idPredio+"/cadastrar", elevador);
  }  

  buscarElevadorDoPredio(idPredio: string, modelo: string): Observable<string>{
    return this.httpClient.get<string>(this.url+"/"+idPredio+"/"+modelo);
  }

  removerElevadorDoPredio(idPredio: string, idElevador: string): Observable<string>{
    return this.httpClient.delete<string>(this.url+"/"+idPredio+"/"+idElevador);
  }

  editarElevadorDoPredio(idPredio: string, idElevador: string, elevador: ElevadorRequest): Observable<string>{
    return this.httpClient.put<string>(this.url+"/"+idPredio+"/"+idElevador, elevador);
  }

  gerarRelatorio(idPredio: string, idElevador: string): Observable<Blob>{
    return this.httpClient.get(this.url+"/"+idPredio+"/"+idElevador+"/relatorio",{
        responseType: 'blob'
    });
  }
}
