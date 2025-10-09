import { Routes } from '@angular/router';
import { PrediosList } from './components/predios-list/predios-list';
import { ElevadoresComponent } from './components/elevadores-list/elevadores-list';
import { LoginPage } from './components/login-page/login-page';
import { authGuard } from './auth-guard';
import { ComponenteList } from './components/componente-list/componente-list';
import { Empresa } from './components/empresa/empresa';

/**
 * Simula a busca por IDs de elevadores para pré-renderização.
 * Em um projeto real, você buscaria esses IDs de uma API ou banco de dados.
 */
export const getElevadorPrerenderParams = async () => {
  const elevadoresIds = [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' }
  ];

  return elevadoresIds;
};

/**
 * Simula a busca por IDs de componentes para pré-renderização.
 */
export const getComponentePrerenderParams = async () => {
  const componentesIds = [
    { id: 'c1' },
    { id: 'c2' },
    { id: 'c3' }
  ];

  return componentesIds;
};

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPage },
  {
    path: 'empresa',
    component: Empresa,
    canActivate: [authGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    
    path: 'predios/:idEmpresa',
    component: PrediosList,
    canActivate: [authGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'elevadores/:id',
    component: ElevadoresComponent,
    canActivate: [authGuard],
    runGuardsAndResolvers: 'always',
    data: { prerender: getElevadorPrerenderParams }
  },
  {
    path: 'componentes/:id',
    component: ComponenteList,
    canActivate: [authGuard],
    runGuardsAndResolvers: 'always',
    data: { prerender: getComponentePrerenderParams }
  },
  { path: '**', redirectTo: 'login' }
];
