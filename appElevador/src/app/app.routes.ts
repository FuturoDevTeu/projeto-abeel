// Exemplo de como deve estar em src/app/app.routes.ts
import { Routes } from '@angular/router';
import { PrediosList } from './components/predios-list/predios-list';
import { ElevadoresComponent } from './components/elevadores-list/elevadores-list';
import { LoginPage } from './components/login-page/login-page';
import { authGuard } from './auth-guard';
import { ComponenteList } from './components/componente-list/componente-list';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {path: 'login', component: LoginPage},
  {
    path: 'predios',
    component: PrediosList,
    canActivate: [authGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'elevadores/:id',
    component: ElevadoresComponent,
    canActivate: [authGuard],
    runGuardsAndResolvers: 'always' // ESSENCIAL: Mantenha esta linha!
  },
  {
    path: 'componentes/:id',
    component: ComponenteList,
    canActivate: [authGuard],
    runGuardsAndResolvers: 'always'
  },
  { path: '**', redirectTo: 'login' }
];