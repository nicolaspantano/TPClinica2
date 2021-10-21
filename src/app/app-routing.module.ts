import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  {path:'',loadChildren: () => import('./auth-module/auth-module-routing.module').then(m => m.AuthModuleRoutingModule)},
  {path:'admin',loadChildren: () => import('./usuarios/usuarios-routing.module').then(m => m.UsuariosRoutingModule),canActivate:[AdminGuard]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
