import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { BoardUserComponent } from './board-user/board-user.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

import { httpInterceptorProviders } from './_helpers/http.interceptor';
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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    BoardAdminComponent,
    BoardUserComponent,
    HeaderComponent,
    FooterComponent,
    GFluxComponent,
    AdminLayoutComponent,
    ConnecteursComponent,
    ApplicationOpenSourceComponent,
    ERPComponent,
    GenerateurFluxComponent,
    UserManagementComponent,
    LogsComponent,
    ErrorManagementComponent,
    UserReportsComponent,
    UserMonitoringComponent,
    FluxLauncherComponent,
    ApplicationOpenSourceModulesComponent,
    ERPModulesComponent,
    ForgotPasswordEmailComponent,
    ResetPasswordEmailComponent,
    UserErpModulesComponent,
    UserAppModulesComponent,
    UserErpComponent,
    UserApplicationsComponent,
    FluxMonitorComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [httpInterceptorProviders, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
