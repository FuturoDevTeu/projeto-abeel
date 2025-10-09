import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { EmpresaType } from '../types/Empresa';
import { EmpresaRequest } from '../types/EmpresaRequest';
import { Empresa } from '../components/empresa/empresa';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  private url = environment.api;

  constructor(private httpClient: HttpClient) { }

  obterEmpresas(): Observable<EmpresaType[]> {
    return this.httpClient.get<EmpresaType[]>(`${this.url}/empresa/todas`);
  }


  cadastrarEmpresa(empresa: EmpresaRequest): Observable<any> {
    return this.httpClient.post(`${this.url}/empresa/cadastrar`, empresa, { responseType: 'text' });
  }

  editarEmpresa(empresa: EmpresaType): Observable<any> {
    return this.httpClient.put(`${this.url}/empresa/editar/${empresa.id}`, empresa, { responseType: 'text' });
  }


  deletarEmpresa(idEmpresa: string): Observable<any> {
    return this.httpClient.delete(`${this.url}/empresa/deletar/${idEmpresa}`, { responseType: 'text' });
  }

  buscarIdEmpresa(predioId: string): Observable<{ empresa: EmpresaType }> {
  return this.httpClient.get<{ empresa: EmpresaType }>(`${this.url}/empresa/buscar/predio/${predioId}`);  
 }

}
