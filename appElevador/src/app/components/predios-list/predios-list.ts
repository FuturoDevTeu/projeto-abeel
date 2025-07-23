import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // ChangeDetectorRef permanece
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

interface Elevador {
  id: string;
  modelo: string;
}

interface Predio {
  id: string;
  nome: string;
  bairro: string;
  elevadores?: Elevador[];
}

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
  private apiUrl = 'http://localhost:8080/predio/listar';

  constructor(
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef // Injetamos o ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.carregarPredios();
  }

  carregarPredios(): void {
    this.http.get<any>(this.apiUrl).subscribe({
      next: (data: any) => {
        this.predios = Array.from(data); // A correção Array.from(data) permanece
        this.selectedPredioId = null;
        this.cdr.detectChanges(); // A força de detecção de mudanças permanece
      },
      error: (error) => {
        console.error('Erro ao carregar prédios:', error); // Mantive este log de erro, é importante
        this.predios = [];
        this.cdr.detectChanges(); // Força detecção mesmo em caso de erro
      }
    });
  }

  selecionarPredio(id: string) {
    this.selectedPredioId = id;
    this.router.navigate(['/elevadores', id]);
  }
}