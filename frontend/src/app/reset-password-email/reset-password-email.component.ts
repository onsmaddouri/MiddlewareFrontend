import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-reset-password-email',
  templateUrl: './reset-password-email.component.html',
  styleUrls: ['./reset-password-email.component.css']
})
export class ResetPasswordEmailComponent implements OnInit {
  form: any = {
    email: null,
    code: null,
    newPassword: null
  };
  isSuccessful = false;
  isResetFailed = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSubmit(): void {
    const { email, code, newPassword } = this.form;

    this.authService.resetPasswordEmail(email, code, newPassword).subscribe({
      next: data => {
        this.successMessage = data.message;
        this.isSuccessful = true;
        this.isResetFailed = false;
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isResetFailed = true;
        this.isSuccessful = false;
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToForgotPassword(): void {
    this.router.navigate(['/forgot-password-email']);
  }

  onCodeInput(event: any): void {
    // Limiter à 6 caractères et seulement des chiffres
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 6) {
      value = value.substring(0, 6);
    }
    event.target.value = value;
    this.form.code = value;
  }
}

