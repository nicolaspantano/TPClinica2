import { Injectable } from '@angular/core';
import { Usuario } from '../clases/usuario';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Paciente } from '../clases/paciente';
import { Especialista } from '../clases/especialista';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user;
  userFire;
  observableUser;
  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) {
    this.observableUser = new BehaviorSubject<any>(this.user);
   }


  Register(email: string, password: string) {

    return new Promise<any>((resolve, rejected) => {
      this.afAuth.createUserWithEmailAndPassword(email, password).then((response: any) => {

        resolve(response);
      }, (error: any) => {
        switch (error.code) {
          case "auth/weak-password":
            rejected("clave muy corta,minimo 6 caracteres");
            break;
          case "auth/invalid-email":
            rejected("email invalido");
            break;
          case "auth/wrong-password":
            rejected("clave invalida");
            break;
          case "auth/email-already-in-use":
            rejected("El correo ya se encuentra tomado");
            break;
          default:
            rejected("ERROR");
            break;
        }
      });
    });
  }

  RegistrarPaciente(paciente: Paciente) {
    return new Promise<any>((resolve, rejected) => {
      this.Register(paciente.correo, paciente.password).then((response) => {
        response.user.sendEmailVerification();
        this.firestore.collection('usuarios').doc(response.user.uid).set({ ...paciente });
        resolve(response);
      }), (error: any) => {
        rejected(error);
      }
    });
  }

  RegistrarAdministrador(admin: Usuario) {
    console.log('aaaa',admin);
    return new Promise<any>((resolve, rejected) => {
      this.Register(admin.correo, admin.password).then((response) => {
        this.firestore.collection('usuarios').doc(response.user.uid).set({ ...admin });
        resolve(response);
      }), (error: any) => {
        rejected(error);
      }
    });
  }



  Login(correo,password){
    return new Promise<any>((resolve,rejected)=>{
      this.afAuth.signInWithEmailAndPassword(correo,password).then((response)=>{
        this.userFire=response.user;
        this.firestore.collection('usuarios').doc(response.user.uid).valueChanges().subscribe((res)=>{
          this.user=res;

          
          resolve(response);
        })
        
      }, (error: any) => {
        switch (error.code) {
          case "auth/user-not-found":
            rejected("El usuario no existe");
            break;
          case "auth/invalid-email":
            rejected("email invalido");
            break;
          case "auth/wrong-password":
            rejected("clave incorrecta");
            break;
          default:
            rejected("ERROR");
            break;
        }
      });
    });
  }

  Logout(){
    this.afAuth.signOut();
    this.user=null;
    this.userFire=null;
    localStorage.clear();
  }
  

  RegistrarEspecialista(especialista:Especialista){
    
    return new Promise<any>((resolve,rejected)=>{
      this.Register(especialista.correo,especialista.password).then((response)=>{
        response.user.sendEmailVerification();
        this.firestore.collection('usuarios').doc(response.user.uid).set({ ...especialista });
        resolve(response);
      }), (error:any)=>{
        rejected(error);
      }
    })
  }






}
