import { Component } from '@angular/core';
import { LoginRequest } from '../../types/LoginRequest';
import { UserService } from '../../services/user-service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [FormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPage {
  login: LoginRequest = {
    username: "",
    password: ""
  };

  constructor(private userService: UserService, private route: Router){}

  fazerLogin(){
    this.userService.logar(this.login).subscribe({
      next: (res) =>{
        console.log('Token recebido: ', res.token);
        sessionStorage.setItem("token", res.token);
        this.route.navigate(['/predios'])
      },
      error: (err) =>{
        if(typeof err.error === 'string'){
          window.alert(err.error);
        }else{
          window.alert("Ocorreu um erro inesperado ");
        } 
      }
    })
  }
  
}
