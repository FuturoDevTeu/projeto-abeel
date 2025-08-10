import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserAuthenticated } from '../types/UserAuthenticated';
import { environment } from '../../environments/environment.development';
import { LoginRequest } from '../types/LoginRequest';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url = environment.api

  constructor(private httpClient: HttpClient) { }

  logar(login: LoginRequest): Observable<UserAuthenticated>{
    return this.httpClient.post<UserAuthenticated>(this.url + '/auth/login', login);
  }
  
}
