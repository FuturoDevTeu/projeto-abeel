import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Elevador } from '../types/Elevador';

@Injectable({
  providedIn: 'root'
})
export class ElevadorService {

  private url = environment.api

  constructor(private httpClient: HttpClient) { }

  carregarElevadoresDoPredio(idPredio: string){
    return this.httpClient.get<Elevador[]>(this.url + '/elevador/'+idPredio+'/listar')
  }
}
