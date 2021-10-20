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
  constructor(private fb:FormBuilder,private authSvc:AuthService,private userSvc:UsuariosService, private router:Router) { 
    this.form = fb.group({
      email:['',[Validators.required,this.validarEmail]],
      password:['',[Validators.required]],
    })
  }

  ngOnInit(): void {
  }

  validarEmail(control:AbstractControl){
    const email = control.value;
    const tieneArroba = email.includes('@');
    if(tieneArroba){
      return null
    }
    return {faltaArroba:true};
  }
  
  enviarForm(){
    
    this.authSvc.Login(this.form.value.email,this.form.value.password).then((res)=>{
      setTimeout(() => {
        if(this.authSvc.user.tipo=='paciente'&&this.authSvc.user.emailVerified==false){
            Swal.fire({
              title:'No puede iniciar sesion',
              text:'Para iniciar sesion debe verificar su identidad con el email que le fue enviado',
              icon:'error',
              confirmButtonText:'Aceptar'
            }).then(()=>{
              this.authSvc.Logout();
            })
        }
        else if(this.authSvc.user.tipo=='especialista'&&this.authSvc.user.verificadoAdmin==false){
          Swal.fire({
            title:'No puede iniciar sesion',
            text:'Para iniciar sesion un administrador debe verificar su identidad',
            icon:'error',
            confirmButtonText:'Aceptar'
          }).then(()=>{
            this.authSvc.Logout();
            
          })
        }
        else{
          Swal.fire({
            title:'Inicio de sesion correcto',
            text:'Bienvenido a la Clinica OnLine',
            icon:'success',
            confirmButtonText:'Continuar'
          }).then(()=>{
            this.router.navigateByUrl('/');
          })
        }
      },2000);
    })
  }
    /*
    this.authSvc.Login(this.form.value.email,this.form.value.password).then((response)=>{
      this.userSvc.BuscarUnPaciente(response.user.uid).subscribe((paciente)=>{
        if(paciente!=undefined){          
          if(response.user.emailVerified==false){
            Swal.fire({
              title:'No puede iniciar sesion',
              text:'Para iniciar sesion debe verificar su identidad con el email que le fue enviado',
              icon:'error',
              confirmButtonText:'Aceptar'
            }).then(()=>{
              this.authSvc.Logout();
            })
          }
          else{
            Swal.fire({
              title:'Inicio de sesion correcto',
              text:'Bienvenido a la Clinica OnLine',
              icon:'success',
              confirmButtonText:'Continuar'
            }).then(()=>{
              this.router.navigateByUrl('/');
            })
          }
        }
        else{
         var observableEspecialista = this.userSvc.BuscarUnEspecialista(response.user.uid);
         observableEspecialista.subscribe((especialista:Especialista)=>{
            if(especialista!=undefined){
              if(especialista.verificadoAdmin==false){
                Swal.fire({
                  title:'No puede iniciar sesion',
                  text:'Para iniciar sesion un administrador debe verificar su identidad',
                  icon:'error',
                  confirmButtonText:'Aceptar'
                }).then(()=>{
                  this.authSvc.Logout();
                  
                })
              }
              else{
                Swal.fire({
                  title:'Inicio de sesion correcto',
                  text:'Bienvenido a la Clinica OnLine',
                  icon:'success',
                  confirmButtonText:'Continuar'
                }).then(()=>{
                  this.router.navigateByUrl('/');
                })
              }
            }
          }).unsubscribe();
        }
      })/*
      console.log(paciente);
      if(paciente!=undefined){
        if(response.user.emailVerified==false){
          Swal.fire({
            title:'No puede iniciar sesion',
            text:'Para iniciar sesion debe verificar su identidad con el email que le fue enviado',
            icon:'error',
            confirmButtonText:'Aceptar'
          }).then(()=>{
            this.authSvc.Logout();
          })
        }
        else{
          Swal.fire({
            title:'Inicio de sesion correcto',
            text:'Bienvenido a la Clinica OnLine',
            icon:'success',
            confirmButtonText:'Continuar'
          }).then(()=>{
            this.router.navigateByUrl('/');
          })
        }
      }
      else{
        var especialista = this.userSvc.BuscarUnEspecialista(response.user.uid);
        console.log(response.user.uid)
        console.log(especialista);

        if(especialista!=undefined){
          if(especialista.verificadoAdmin==false){
            Swal.fire({
              title:'No puede iniciar sesion',
              text:'Para iniciar sesion un administrador debe verificar su identidad',
              icon:'error',
              confirmButtonText:'Aceptar'
            }).then(()=>{
              this.authSvc.Logout();
            })
          }
          else{
            Swal.fire({
              title:'Inicio de sesion correcto',
              text:'Bienvenido a la Clinica OnLine',
              icon:'success',
              confirmButtonText:'Continuar'
            }).then(()=>{
              this.router.navigateByUrl('/');
            })
          }
        }
      }
      
    })
  }*/

}
