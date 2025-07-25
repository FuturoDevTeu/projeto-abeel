  import { CommonModule } from '@angular/common';
  import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // ChangeDetectorRef permanece
  import { MatCardModule } from '@angular/material/card';
  import { Router } from '@angular/router';
  import { PredioService } from '../../services/predio-service';
  import { Predio } from '../../types/Predio';
  import { Header } from "../header/header";
  import { PredioRequest } from '../../types/PredioRequest';
  import { FormsModule } from '@angular/forms';

  @Component({
    selector: 'app-predios-list',
    standalone: true,
    imports: [MatCardModule, CommonModule, Header, FormsModule],
    templateUrl: './predios-list.html',
    styleUrls: ['./predios-list.css']
  })
  export class PrediosList implements OnInit {

    predios: Predio[] = [];
    selectedPredioId: string | null = null;
    isModalOpen = false;
    predio: PredioRequest = {nome: "", bairro: ""} ;


    constructor(
      private router: Router,
      private cdr: ChangeDetectorRef,
      private predioService: PredioService

    ) { }

    ngOnInit(): void {
      this.carregarPredios()
    }

    abrirModalPredio() {
      this.isModalOpen = true;
    } 
    
    submitForm(){
      if (this.predio.nome && this.predio.bairro) {
        this.cadastrarPredio(this.predio);
        this.predio = { nome: '', bairro: '' };
        this.isModalOpen = false;
      }
    }

    carregarPredios(){
      this.predioService.obterPredios()
        .subscribe({
          next: (predios) =>{
            this.predios = Array.from(predios);
            this.selectedPredioId = null;
            this.cdr.detectChanges();  
          },
          error: (error) =>{
            console.error('Erro ao carregar predios '+ error),
            this.predios = [],
            this.cdr.detectChanges();
          }
        });
    }

    cadastrarPredio(predio: PredioRequest){
      this.predioService.cadastrarPredio(predio)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.cdr.detectChanges();
          this.carregarPredios();
        },
        error: (err) =>{
          console.log(err)
          this.cdr.detectChanges();
        }
      })
    }

    buscarPredio(nomePredio: string){
      this.predioService.buscarPredio(nomePredio)
      .subscribe({
        next: (predios) => {
          this.predios = Array.from(predios);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.cdr.detectChanges();
        }
      })
    }

    deletarPredio(idPredio: string){
      this.predioService.deletarPredio(idPredio)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.cdr.detectChanges();
          this.carregarPredios();
        },
        error: (err) => {
          console.error(err);
          this.cdr.detectChanges();
        }
      })
    }

    editarPredio(predio: Predio){
      this.predioService.editarPredio(predio)
      .subscribe({
        next: (res) =>{
          console.log(res)
          this.cdr.detectChanges();
          this.carregarPredios();
        },
        error: (err) =>{
          console.error(err)
          this.cdr.detectChanges();
        },
      })
    }


    selecionarPredio(id: string){
      this.selectedPredioId = id;
      this.router.navigate(['/elevadores', id])
    }
  }