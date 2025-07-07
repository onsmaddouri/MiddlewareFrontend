import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

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
    GenerateurFluxComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
