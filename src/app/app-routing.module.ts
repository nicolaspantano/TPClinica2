import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  {path :'',component:HomeComponent},
  {path:'auth',loadChildren: () => import('./auth-module/auth-module-routing.module').then(m => m.AuthModuleRoutingModule)},
  {path:'admin',loadChildren: () => import('./usuarios/usuarios-routing.module').then(m => m.UsuariosRoutingModule),canActivate:[AdminGuard]},
  {path:'turnos',loadChildren: () => import('./turnos/turnos-routing.module').then(m => m.TurnosRoutingModule)}

  
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
