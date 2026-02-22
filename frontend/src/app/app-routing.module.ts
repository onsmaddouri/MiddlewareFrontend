import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardUserComponent } from './board-user/board-user.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { GFluxComponent } from './gflux/gflux.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { ConnecteursComponent } from './connecteurs/connecteurs.component';
import { ApplicationOpenSourceComponent } from './applications-open-source/application-open-source.component';
import { ERPComponent } from './erp/erp.component';
import { GenerateurFluxComponent } from './generateur-flux/generateur-flux.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { LogsComponent } from './logs/logs.component';
import { ErrorManagementComponent } from './error-management/error-management.component';
import { UserReportsComponent } from './user-reports/user-reports.component';
import { UserMonitoringComponent } from './user-monitoring/user-monitoring.component';
import { FluxLauncherComponent } from './flux-launcher/flux-launcher.component';
import { ApplicationOpenSourceModulesComponent } from './application-open-source-modules/application-open-source-modules.component';
import { ERPModulesComponent } from './erp-modules/erp-modules.component';
import { ForgotPasswordEmailComponent } from './forgot-password-email/forgot-password-email.component';
import { ResetPasswordEmailComponent } from './reset-password-email/reset-password-email.component';
import { UserErpModulesComponent } from './user-erp-modules/user-erp-modules.component';
import { UserAppModulesComponent } from './user-app-modules/user-app-modules.component';
import { UserErpComponent } from './user-erp/user-erp.component';
import { UserApplicationsComponent } from './user-applications/user-applications.component';
import { FluxMonitorComponent } from './flux-monitor/flux-monitor.component';
const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password-email', component: ForgotPasswordEmailComponent },
  { path: 'reset-password-email', component: ResetPasswordEmailComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'user', component: BoardUserComponent },
  { path: 'user/flux', component: GFluxComponent },
  { path: 'user/launch-flux', component: FluxLauncherComponent },
  { path: 'user/reports', component: UserReportsComponent },
  { path: 'user/monitoring', component: UserMonitoringComponent },
  { path: 'user/erp-modules', component: UserErpModulesComponent },
  { path: 'user/app-modules', component: UserAppModulesComponent },
  { path: 'user/erp', component: UserErpComponent },
  { path: 'user/applications', component: UserApplicationsComponent },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: BoardAdminComponent },
      { path: 'flux', component: GFluxComponent },
      { path: 'connecteurs', component: ConnecteursComponent },
      { path: 'applications', component: ApplicationOpenSourceComponent },
      { path: 'application-modules', component: ApplicationOpenSourceModulesComponent },
      { path: 'erp', component: ERPComponent },
      { path: 'erp-modules', component: ERPModulesComponent },
      { path: 'generateurs', component: GenerateurFluxComponent },
      { path: 'users', component: UserManagementComponent },
      { path: 'logs', component: LogsComponent },
      { path: 'errors', component: ErrorManagementComponent },
      { path: 'flux-monitor', component: FluxMonitorComponent },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
