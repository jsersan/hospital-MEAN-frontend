import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { PerfilComponent } from './perfil/perfil.component';

// Mantenimientos
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';

import { HospitalesComponent } from './mantenimientos/hospitales/hospitales.component';
import { HospitalComponent } from './mantenimientos/hospitales/hospital.component';
import { MedicosComponent } from './mantenimientos/medicos/medicos.component';
import { MedicoComponent } from './mantenimientos/medicos/medico.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { AdminGuard} from '../guards/admin.guard';
import { RouterModule, Routes } from '@angular/router';

const ChildRoutes: Routes = [
  { path: '', component: DashboardComponent, data: { titulo: 'Dashboard' } },
  { path: 'account-settings', component: AccountSettingsComponent, data: { titulo: 'Ajustes de cuenta' }},
  { path: 'buscar/:termino', component: BusquedaComponent, data: { titulo: 'Búsquedas' }},
  { path: 'grafica1', component: Grafica1Component, data: { titulo: 'Gráfica #1' }},                        
  { path: 'perfil', component: PerfilComponent, data: { titulo: 'Perfil de usuario' }},
  { path: 'progress', component: ProgressComponent, data: { titulo: 'ProgressBar' }},            
  { path: 'promesas', component: PromesasComponent, data: { titulo: 'Promesas' }},
  { path: 'rxjs', component: RxjsComponent, data: { titulo: 'RxJs' }},


  // Mantenimientos
  { path: 'hospitales', component: HospitalesComponent, data: { titulo: 'Matenimiento de Hospitales' }},           
  { path: 'medicos', component: MedicosComponent, data: { titulo: 'Matenimiento de Médicos' }},
  { path: 'medico/:id', component: MedicoComponent, data: { titulo: 'Matenimiento de Médico' }},
  { path: 'hospital/:id', component: HospitalComponent, data: { titulo: 'Matenimiento de Hospital' }},
  
  // Rutas de admin
  { path: 'usuarios', canActivate: [AdminGuard] ,component: UsuariosComponent, data: { titulo: 'Matenimiento de Usuarios' }},
]

@NgModule({
  imports: [ RouterModule.forChild(ChildRoutes) ],
  exports: [ RouterModule ]
})

export class ChildRoutesModule { }
