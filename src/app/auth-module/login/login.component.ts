import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Especialista } from 'src/app/clases/especialista';
import { AuthService } from 'src/app/servicios/auth.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loading=false;
  form:FormGroup;
  hardcode = null;
  constructor(private fb:FormBuilder,private authSvc:AuthService,private userSvc:UsuariosService, private router:Router) { 
    this.form = fb.group({
      email:['',[Validators.required,this.validarEmail]],
      password:['',[Validators.required]],
    })
  }

  ngOnInit(): void {
    this.userSvc.TraerHardcore().subscribe((res=>{
      this.hardcode=res;
    }))
  }

  validarEmail(control:AbstractControl){
    const email = control.value;
    const tieneArroba = email.includes('@');
    if(tieneArroba){
      return null
    }
    return {faltaArroba:true};
  }

  traerUsuariosHardcodear(){
    
  }
  
  enviarForm(){
    
    this.authSvc.Login(this.form.value.email,this.form.value.password).then((res)=>{
      console.log(this.authSvc.userFire);
        
        if(this.authSvc.user.tipo=='especialista'&&this.authSvc.user.verificadoAdmin==false){
          Swal.fire({
            title:'No puede iniciar sesion',
            text:'Para iniciar sesion un administrador debe verificar su identidad',
            icon:'error',
            confirmButtonText:'Aceptar'
          }).then(()=>{
            this.authSvc.Logout();
            window.location.href="/";

            
          })
        }
        else if(this.authSvc.userFire.emailVerified==false){
          Swal.fire({
            title:'No puede iniciar sesion',
            text:'Para iniciar sesion debe verificar su identidad con el email que le fue enviado',
            icon:'error',
            confirmButtonText:'Aceptar'
          }).then(()=>{
            this.authSvc.Logout();
            window.location.href="/";
          })
      }
        else{
          Swal.fire({
            title:'Inicio de sesion correcto',
            text:'Bienvenido a la Clinica OnLine',
            icon:'success',
            confirmButtonText:'Continuar'
          }).then(()=>{
            localStorage.setItem('token',this.authSvc.user.correo);
            this.router.navigateByUrl('/');
          })
        }
    })
  }
  setearHardcode(e){
    
        this.form.patchValue({
          email:e.correo,
          password:'12341234'
        })
        
    
  }

}
