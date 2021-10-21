import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadesService {

  constructor(private firestore:AngularFirestore) { }

  TraerTodas(){

    return new Promise<any>((resolve,rejected)=>{
      this.firestore.collection('especialidades').valueChanges().subscribe((res)=>{
        resolve(res);
      })
    })
  }

  AgregarUna(especialidad){
    this.firestore.collection('especialidades').add({...especialidad});
  }
}
