import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Especialista } from '../clases/especialista';
import { Usuario } from '../clases/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private firestore:AngularFirestore) { }

  /*BuscarUnPaciente(uid){
    return this.firestore.collection('pacientes').doc(uid).valueChanges();
  }

  BuscarUnEspecialista(uid){
    return this.firestore.collection('especialistas').doc(uid).valueChanges();
      
  }*/

  BuscarDentistas(){
    return this.firestore.collection('especialistas',(ref)=> ref.where('especialidad','==','Dentista'));
  }

  TraerTodos(){
    return this.firestore.collection('usuarios').valueChanges();
  }

  BuscarUsuario(usuario:Usuario){
 
      return this.firestore.collection('usuarios',(ref)=>ref.where('correo','==',usuario.correo)).get();

  }

  ValidarEspecialista(especialista:Especialista){
    this.BuscarUsuario(especialista).subscribe(res=>{
      this.firestore.collection('usuarios').doc(res.docs[0].id).update({
        'verificadoAdmin' :true
      })
    })
  }
  ActualizarImagen(uid,imagen,uri){
    if(imagen==1){
      this.firestore.collection('usuarios').doc(uid).update({
        'imagen1' : uri
      });
    }else if(imagen==2){
      this.firestore.collection('usuarios').doc(uid).update({
        'imagen2' : uri
      });
    }
    
  }

  TraerHardcore(){
    return this.firestore.collection('hardcode').valueChanges();
  }
}
