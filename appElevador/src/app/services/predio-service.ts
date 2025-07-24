import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Predio } from '../types/Predio';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PredioService {

  private url = environment.api

  constructor(private httpClient: HttpClient) { }

  obterPredios(): Observable<Predio[]>{
    return this.httpClient.get<Predio[]>(this.url + '/predio/listar')
  }

  cadastrarPredio(predio: Predio){
    return this.httpClient.post<string>(this.url + '/predio/cadastrar', predio)
  }
}
