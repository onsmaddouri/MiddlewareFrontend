import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-forgot-password-email',
  templateUrl: './forgot-password-email.component.html',
  styleUrls: ['./forgot-password-email.component.css']
})
export class ForgotPasswordEmailComponent implements OnInit {
  form: any = {
    email: null
  };
  isSuccessful = false;
  isSendFailed = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSubmit(): void {
    const { email } = this.form;

    this.authService.forgotPasswordEmail(email).subscribe({
      next: data => {
        this.successMessage = data.message;
        this.isSuccessful = true;
        this.isSendFailed = false;
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSendFailed = true;
        this.isSuccessful = false;
      }
    });
  }

  goToResetPassword(): void {
    this.router.navigate(['/reset-password-email']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}

