import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from './servicios/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TPClinica2';
  usuario = null;
  constructor(public authSvc:AuthService,private router:Router){
    
  }



  Logout(){
    Swal.fire({
      title:'Hasta luego!',
      confirmButtonText:'Volver al inicio',
      icon:'success'
    }).then(()=>{
      this.authSvc.Logout();
      window.location.href="/";
    })
    
    
  }
}
