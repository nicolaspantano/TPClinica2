import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Paciente } from 'src/app/clases/paciente';
import { AuthService } from 'src/app/servicios/auth.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { exit } from 'process';
import { Especialista } from 'src/app/clases/especialista';
import { EspecialidadesService } from 'src/app/servicios/especialidades.service';
import { Usuario } from 'src/app/clases/usuario';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  admin = false;
  numero1=0;
  numero2=0;
  formPaciente:FormGroup;
  formEspecialista:FormGroup;
  formAdministrador:FormGroup;

  clasesEleccion = 'col-6';

  nuevaEspec;
  foto1;
  foto2;
  especialidades;
  especialidadElegida;
  nueva=false;
  tipoRegistro="";

  constructor(private fb:FormBuilder,private storage:AngularFireStorage, private authSvc:AuthService, private router:Router, private especSvc:EspecialidadesService, private userSvc:UsuariosService, private _route: ActivatedRoute) {
    
    this.numero1=Math.floor(Math.random() * (60 - 1)) + 1;
    this.numero2=Math.floor(Math.random() * (60 - 1)) + 1;

    this._route.queryParams.subscribe(params => {
      console.log(params);
      if(params && params.admin=='true'){
        this.admin=true;
      }
    })
    
    
    this.formPaciente = fb.group({
      nombre:['',[Validators.required]],
      apellido:['',[Validators.required]],
      edad:['',[Validators.required]],
      dni:['',[Validators.required,Validators.min(11111111),Validators.max(99999999)]],
      obraSocial:['',[Validators.required]],
      email:['',[Validators.required,this.validarEmail]],
      password:['',[Validators.required]],
      imagen1:['',[Validators.required,this.validarImagen]],
      imagen2:['',[Validators.required,this.validarImagen]],
      captcha:['',[Validators.required]]

      

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
      captcha:['',[Validators.required]],
      nuevaEspec:['']

    })
    this.formEspecialista.get('nuevaEspec').disable();

    if(this.admin){
      this.clasesEleccion='col-4';
      this.formAdministrador = fb.group({
        nombre:['',[Validators.required]],
        apellido:['',[Validators.required]],
        edad:['',[Validators.required]],
        dni:['',[Validators.required,Validators.min(11111111),Validators.max(99999999)]],
        email:['',[Validators.required,this.validarEmail]],
        password:['',[Validators.required]],
        imagen1:['',[Validators.required,this.validarImagen]],
        captcha:['',[Validators.required]]

      })
    }
    
    this.especSvc.TraerTodas().then((res)=>{
      this.especialidades=res;
      console.log(this.especialidades)
    })
    
    



   }

  ngOnInit(): void {
  }
  validarCaptcha(form){
    console.log('this',this)
    if(form.value.captcha!=(this.numero1+this.numero2)){
      console.log('da false');
      return false
    }
    return true;
  }

  enviarFormPaciente(){

    if(this.validarCaptcha(this.formPaciente)==false){
      Swal.fire({
        title:'Ups!!',
        text: 'Captcha incorrecto. Intente de nuevo',
        confirmButtonText: 'Volver a intentar',
        icon:'error'
      })
    }
    else{

    
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
      this.storage.upload(ruta1, this.foto1).then((res)=>{
        res.ref.getDownloadURL().then((url)=>{
          console.log(res);
          this.userSvc.ActualizarImagen(id,1,url);
        })
      })
    }

    if (this.foto2) {
      var ruta2 = `/usuarios/${id}/${2}`;
      this.storage.upload(ruta2, this.foto2).then((res)=>{
        res.ref.getDownloadURL().then((url)=>{
          console.log(res);
          this.userSvc.ActualizarImagen(id,2,url);
        })
      })
    }
  }


  enviarFormAdministrador(){
    if(this.validarCaptcha(this.formAdministrador)==false){
      Swal.fire({
        title:'Ups!!',
        text: 'Captcha incorrecto. Intente de nuevo',
        confirmButtonText: 'Volver a intentar',
        icon:'error'
      })
    }
    else{
    var administrador = new Usuario();
    administrador.nombre = this.formAdministrador.value.nombre;
    administrador.apellido = this.formAdministrador.value.apellido;
    administrador.edad = this.formAdministrador.value.edad;
    administrador.dni = this.formAdministrador.value.dni;
    administrador.correo = this.formAdministrador.value.email;
    administrador.password = this.formAdministrador.value.password;
    administrador.imagen1 = 1;
    administrador.tipo='administrador';
    
    this.authSvc.RegistrarAdministrador(administrador).then((response)=>{
      this.subirFotos(response.user.uid);
      Swal.fire({
        title:'Registro exitoso!!',
        text:'Ha registrado un nuevo administrador',
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

  enviarFormEspecialista(){
    if(this.validarCaptcha(this.formEspecialista)==false){
      Swal.fire({
        title:'Ups!!',
        text: 'Captcha incorrecto. Intente de nuevo',
        confirmButtonText: 'Volver a intentar',
        icon:'error'
      })
    }
    else{


    var arr = new Array();
    arr = this.formEspecialista.value.especialidad;
    var i = arr.indexOf('nueva');
    if(i!=-1){
      arr.splice(i,1);
      arr.push(this.formEspecialista.value.nuevaEspec); 
      this.especSvc.AgregarUna({nombre : this.formEspecialista.value.nuevaEspec})
    }
    var especialista = new Especialista();
    especialista.nombre = this.formEspecialista.value.nombre;
    especialista.apellido = this.formEspecialista.value.apellido;
    especialista.edad = this.formEspecialista.value.edad;
    especialista.dni = this.formEspecialista.value.dni;
    especialista.especialidad = arr;
    especialista.correo = this.formEspecialista.value.email;
    especialista.password = this.formEspecialista.value.password;
    especialista.imagen1 = 1;
    especialista.verificadoAdmin=false;
    especialista.tipo='especialista';

    console.log(especialista)
    this.authSvc.RegistrarEspecialista(especialista).then((response) => {
      if(this.nueva==true){
        this.especSvc.AgregarUna({nombre:this.formEspecialista.value.especialidad});
      }
      this.subirFotos(response.user.uid);
      Swal.fire({
        title:'Registro exitoso!!',
        text:'Un administrador debe validar su usuario para que pueda ingresar, ademas de validar su identidad con su correo electronico.',
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

  onChangeEspecialidad(e){
    var arr = new Array();
    arr = this.formEspecialista.value.especialidad;
    console.log(arr);
    if(arr.indexOf('nueva')!=-1){
      this.formEspecialista.get('nuevaEspec').enable();
    }else{
      this.formEspecialista.get('nuevaEspec').disable();
    }
    
  }

}
