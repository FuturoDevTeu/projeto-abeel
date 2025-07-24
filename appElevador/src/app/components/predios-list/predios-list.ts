import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // ChangeDetectorRef permanece
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { PredioService } from '../../services/predio-service';
import { Predio } from '../../types/Predio';

@Component({
  selector: 'app-predios-list',
  standalone: true,
  imports: [MatCardModule, CommonModule],
  templateUrl: './predios-list.html',
  styleUrls: ['./predios-list.css']
})
export class PrediosList implements OnInit {

  predios: Predio[] = [];
  selectedPredioId: string | null = null;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private predioService: PredioService

  ) { }

  ngOnInit(): void {
    this.carregarPredios()
  }

  carregarPredios(){
    console.log(sessionStorage.getItem('token'))
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
          this.cdr.detectChanges;
        }
      });
  }
  selecionarPredio(id: string){
    this.selectedPredioId = id;
    this.router.navigate(['/elevadores', id])
  }
}