import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Predio } from '../types/Predio';
import { Observable } from 'rxjs';
import { PredioRequest } from '../types/PredioRequest';

@Injectable({
  providedIn: 'root'
})
export class PredioService {

  private url = environment.api

  constructor(private httpClient: HttpClient) { }

  obterPredios(): Observable<Predio[]>{
    return this.httpClient.get<Predio[]>(this.url + '/predio/listar')
  }

  cadastrarPredio(predio: PredioRequest): Observable<string>{
    return this.httpClient.post<string>(this.url + '/predio/cadastrar', predio)
  }

  buscarPredio(nomePredio: string): Observable<Predio[]>{
    return this.httpClient.get<Predio[]>(this.url+"/predio/buscar/"+nomePredio);
  }

  deletarPredio(idPredio: string): Observable<string>{
    return this.httpClient.delete<string>(this.url+"/deletar/"+idPredio);
  }

  editarPredio( predio: Predio): Observable<string>{
    return this.httpClient.put<string>(this.url+"/editar/"+predio.id, predio);
  }
}
