import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { PerfilComponent } from './perfil/perfil.component';
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';
import { AdminGuard } from '../guards/admin.guard';
import { MedicosComponent } from './mantenimientos/medicos/medicos.component';
import { MedicoComponent } from './mantenimientos/medicos/medico.component';
import { HospitalesComponent } from './mantenimientos/hospitales/hospitales.component';
import { routes } from '../app-routing.module';

const childRoutes: Routes = [
  {path: '', component: DashboardComponent, data: { titulo: 'Dashboard'}},
  {path: 'progress', component: ProgressComponent, data: { titulo: 'ProgressBar'}},
  {path: 'grafica1', component: Grafica1Component, data: { titulo: 'Grafica #1'}},
  {path: 'account-settings', component: AccountSettingsComponent, data: { titulo: 'Ajustes'}},
  {path: 'buscar/:termino', component: BusquedaComponent, data: { titulo: 'Busquedas'}},
  {path: 'promesas', component: PromesasComponent, data: { titulo: 'Promesas'}},
  {path: 'rxjs', component: RxjsComponent, data: { titulo: 'Rxjs'}},
  {path: 'perfil', component: PerfilComponent, data: { titulo: 'Perfil'}},
  // {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  // mantenimientos
  {path: 'usuarios', canActivate: [ AdminGuard ] , component: UsuariosComponent, data: { titulo: 'Mantenimiento de Usuarios'}},
  {path: 'medicos', component: MedicosComponent, data: { titulo: 'Mantenimiento de Medicos'}},
  {path: 'medico/:id', component: MedicoComponent, data: { titulo: 'Mantenimiento de Medicos'}},
  {path: 'hospitales', component: HospitalesComponent, data: { titulo: 'Mantenimiento de Hospitales'}},
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(childRoutes),
  ],
  exports: [
    RouterModule
  ]
})
export class ChildRoutesModule { }
