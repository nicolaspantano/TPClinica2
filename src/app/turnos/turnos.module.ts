import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SacarTurnoComponent } from './sacar-turno/sacar-turno.component';
import { MisTurnosComponent } from './mis-turnos/mis-turnos.component';
import { TurnosRoutingModule } from './turnos-routing.module';



@NgModule({
  declarations: [
    SacarTurnoComponent,
    MisTurnosComponent
  ],
  imports: [
    CommonModule,
    TurnosRoutingModule
  ]
})
export class TurnosModule { }
