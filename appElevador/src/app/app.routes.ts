// Exemplo de como deve estar em src/app/app.routes.ts
import { Routes } from '@angular/router';
import { PrediosList } from './components/predios-list/predios-list';
import { ElevadoresComponent } from './components/elevadores-list/elevadores-list';

export const routes: Routes = [
  { path: '', redirectTo: 'predios', pathMatch: 'full' },
  {
    path: 'predios',
    component: PrediosList,
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'elevadores/:id',
    component: ElevadoresComponent,
    runGuardsAndResolvers: 'always' // ESSENCIAL: Mantenha esta linha!
  },
  { path: '**', redirectTo: 'predios' }
];