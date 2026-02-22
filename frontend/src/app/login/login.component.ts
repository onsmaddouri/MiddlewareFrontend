import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { StorageService } from '../_services/storage.service';
import { EventBusService } from '../_shared/event-bus.service';
import { EventData } from '../_shared/event.class';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: any = {
    username: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router,
    private eventBusService: EventBusService
  ) {}

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles;
      this.redirectUser(); // Redirige si déjà connecté
    }
  }

  onSubmit(): void {
    const { username, password } = this.form;

    this.authService.login(username, password).subscribe({
      next: data => {
        this.storageService.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.storageService.getUser().roles;
        this.eventBusService.emit(new EventData('login', null));
        this.redirectUser(); // Redirige après login
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    });
  }

  redirectUser(): void {
    const user = this.storageService.getUser();
    const roles = user.roles;

    if (roles.includes('ROLE_ADMIN')) {
      this.router.navigate(['/admin']);
    } else if (roles.includes('ROLE_USER')) {
      this.router.navigate(['/user']);
    } else {
      this.router.navigate(['/home']);
    }
  }

  onForgotPassword(event: Event): void {
    event.preventDefault();
    // Rediriger vers la page de réinitialisation par email
    this.router.navigate(['/forgot-password-email']);
  }
}
