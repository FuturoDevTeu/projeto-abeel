import { Routes } from '@angular/router';
import { PrediosList } from './components/predios-list/predios-list';
import { ElevadoresList } from './components/elevadores-list/elevadores-list';


export const routes: Routes = [
    
    { path: '', redirectTo: 'predios', pathMatch: 'full' },
    { path: 'predios', component: PrediosList },
    { path: 'elevadores/:id', component: ElevadoresList }

];
