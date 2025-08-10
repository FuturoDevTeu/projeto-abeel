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

  cadastrarPredio(predio: PredioRequest): Observable<any>{
    return this.httpClient.post(this.url + '/predio/cadastrar', predio, {responseType: 'text'});
  }

  buscarPredio(nomePredio: string): Observable<Predio[]>{
    return this.httpClient.get<Predio[]>(this.url+"/predio/buscar/"+nomePredio);
  }

  deletarPredio(idPredio: string): Observable<any>{
    return this.httpClient.delete(this.url+"/predio/deletar/"+idPredio, {responseType: 'text'});
  }

  editarPredio( predio: Predio): Observable<any>{
    return this.httpClient.put(this.url+"/predio/editar/"+predio.id, predio, {responseType: 'text'});
  }
}
