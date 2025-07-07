import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardUserComponent } from './board-user/board-user.component';
import { BoardModeratorComponent } from './board-moderator/board-moderator.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { ConnecteursComponent } from './connecteurs/connecteurs.component';
import { FluxComponent } from './flux/flux.component';
import { ApplicationOpenSourceComponent } from './application-open-source/application-open-source.component';
import { ERPComponent } from './erp/erp.component';
import { GenerateurFluxComponent } from './generateur-flux/generateur-flux.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'user', component: BoardUserComponent },
  { path: 'mod', component: BoardModeratorComponent },
  { path: 'admin', component: BoardAdminComponent },
  { path: 'connecteurs', component: ConnecteursComponent },
  { path: 'flux', component: FluxComponent },
  { path: 'applications', component: ApplicationOpenSourceComponent },
  { path: 'erp', component: ERPComponent },
  { path: 'generateur-flux', component: GenerateurFluxComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
