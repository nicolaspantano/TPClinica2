import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private firestore:AngularFirestore) { }

  BuscarUnPaciente(uid){
    return this.firestore.collection('pacientes').doc(uid).valueChanges();
  }

  BuscarUnEspecialista(uid){
    return this.firestore.collection('especialistas').doc(uid).valueChanges();
      
  }

  BuscarDentistas(){
    return this.firestore.collection('especialistas',(ref)=> ref.where('especialidad','==','Dentista'));
  }
}
