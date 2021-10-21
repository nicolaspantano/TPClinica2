import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {


  pagePacientes = 1;
  pageEspecialistas = 1;
  pageAdministradores = 1;

  pageSize = 5;


  listaUsuarios=[];

  pacientes;
  pacientesPag;

  especialistas;
  especialistasPag;

  administradores;
  administradoresPag;

  constructor(private usuariosSvc:UsuariosService) {
    this.usuariosSvc.TraerTodos().subscribe((res)=>{
      this.listaUsuarios = res;
      this.pacientes = this.listaUsuarios.filter(user => user.tipo=='paciente');
      this.especialistas = this.listaUsuarios.filter(user => user.tipo=='especialista');
      this.administradores= this.listaUsuarios.filter(user => user.tipo=='administrador');
      this.refreshPacientes();
      this.refreshEspecialistas();
      this.refreshAdministradores();
    })
   }

  ngOnInit(): void {
  }


  refreshPacientes() {
    this.pacientesPag = this.pacientes
      .map((country, i) => ({id: i + 1, ...country}))
      .slice((this.pagePacientes - 1) * this.pageSize, (this.pagePacientes - 1) * this.pageSize + this.pageSize);
  }

  refreshEspecialistas() {
    this.especialistasPag = this.especialistas
      .map((country, i) => ({id: i + 1, ...country}))
      .slice((this.pageEspecialistas - 1) * this.pageSize, (this.pageEspecialistas - 1) * this.pageSize + this.pageSize);
  }

  refreshAdministradores() {
    this.administradoresPag = this.administradores
      .map((country, i) => ({id: i + 1, ...country}))
      .slice((this.pageAdministradores - 1) * this.pageSize, (this.pageAdministradores - 1) * this.pageSize + this.pageSize);
  }

  verificarEspecialista(especialista){
    this.usuariosSvc.ValidarEspecialista(especialista);
    especialista.verificadoAdmin=true;
      
    
  }
}
