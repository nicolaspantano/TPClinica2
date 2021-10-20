import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Paciente } from 'src/app/clases/paciente';
import { AuthService } from 'src/app/servicios/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { exit } from 'process';
import { Especialista } from 'src/app/clases/especialista';
@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  formPaciente:FormGroup;
  formEspecialista:FormGroup;


  foto1;
  foto2;

  tipoRegistro="";

  constructor(private fb:FormBuilder,private storage:AngularFireStorage, private authSvc:AuthService, private router:Router) {
    this.formPaciente = fb.group({
      nombre:['',[Validators.required]],
      apellido:['',[Validators.required]],
      edad:['',[Validators.required]],
      dni:['',[Validators.required,Validators.min(11111111),Validators.max(99999999)]],
      obraSocial:['',[Validators.required]],
      email:['',[Validators.required,this.validarEmail]],
      password:['',[Validators.required]],
      imagen1:['',[Validators.required,this.validarImagen]],
      imagen2:['',[Validators.required,this.validarImagen]]

    })

    this.formEspecialista = fb.group({
      nombre:['',[Validators.required]],
      apellido:['',[Validators.required]],
      edad:['',[Validators.required]],
      dni:['',[Validators.required,Validators.min(11111111),Validators.max(99999999)]],
      especialidad:['',[Validators.required]],
      email:['',[Validators.required,this.validarEmail]],
      password:['',[Validators.required]],
      imagen1:['',[Validators.required,this.validarImagen]],
    })
    


   }

  ngOnInit(): void {
  }


  enviarFormPaciente(){
    var paciente = new Paciente();
    paciente.nombre = this.formPaciente.value.nombre;
    paciente.apellido = this.formPaciente.value.apellido;
    paciente.edad = this.formPaciente.value.edad;
    paciente.dni = this.formPaciente.value.dni;
    paciente.obraSocial = this.formPaciente.value.obraSocial;
    paciente.correo = this.formPaciente.value.email;
    paciente.password = this.formPaciente.value.password;
    paciente.imagen1 = 1;
    paciente.imagen2 = 2;
    paciente.tipo='paciente';
    this.authSvc.RegistrarPaciente(paciente).then((response) => {
      this.subirFotos(response.user.uid);
      Swal.fire({
        title:'Registro exitoso!!',
        text:'Se le ha enviado un email de verificacion. Debe aceptarlo para poder iniciar sesion',
        icon:'success',
        confirmButtonText:'Volver al inicio'
      }).then(()=>{
        this.router.navigateByUrl('/');
      })
    }), (e:any)=>{
      alert(e);
    }

  }

  validarEmail(control:AbstractControl){
    const email = control.value;
    const tieneArroba = email.includes('@');
    if(tieneArroba){
      return null
    }
    return {faltaArroba:true};
  }

  validarImagen(control:AbstractControl){
    var ext = control.value.split('.')[1];
    if(ext=='jpg'||ext=='jpeg'||ext=='png'){
      return null
    }
    return {formatoInvalido:true}

  }


  cambioFoto(e:any, numero){
    if (numero == 1) {
      this.foto1 = e.target.files[0];
    } else {
      this.foto2 = e.target.files[0];
    }
    console.log(this.foto1);
  }

  subirFotos(id: string) {
    if (this.foto1) {
      var ruta1 = `/usuarios/${id}/${1}`;
      this.storage.upload(ruta1, this.foto1);
    }

    if (this.foto2) {
      var ruta2 = `/usuarios/${id}/${2}`;
      this.storage.upload(ruta2, this.foto2);
    }
  }



  enviarFormEspecialista(){
    var especialista = new Especialista();
    especialista.nombre = this.formEspecialista.value.nombre;
    especialista.apellido = this.formEspecialista.value.apellido;
    especialista.edad = this.formEspecialista.value.edad;
    especialista.dni = this.formEspecialista.value.dni;
    especialista.especialidad = this.formEspecialista.value.especialidad;
    especialista.correo = this.formEspecialista.value.email;
    especialista.password = this.formEspecialista.value.password;
    especialista.imagen1 = 1;
    especialista.verificadoAdmin=false;
    especialista.tipo='especialista';

    console.log(especialista)
    this.authSvc.RegistrarEspecialista(especialista).then((response) => {
      this.subirFotos(response.user.uid);
      Swal.fire({
        title:'Registro exitoso!!',
        text:'Un administrador debe validar su usuario para que pueda ingresar',
        icon:'success',
        confirmButtonText:'Volver al inicio'
      }).then(()=>{
        this.router.navigateByUrl('/');
      })
    }), (e:any)=>{
      alert(e);
    }
  }

}
