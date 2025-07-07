import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NewsletterService } from '../_services/newsletter.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  newsletterForm: FormGroup;
  isSubmitting = false;
  newsletterMessage = '';
  newsletterError = '';

  constructor(
    private fb: FormBuilder,
    private newsletterService: NewsletterService
  ) {
    this.newsletterForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {}

  onSubmitNewsletter(): void {
    if (this.newsletterForm.valid) {
      this.isSubmitting = true;
      this.newsletterMessage = '';
      this.newsletterError = '';

      const email = this.newsletterForm.get('email')?.value;

      this.newsletterService.subscribe(email).subscribe({
        next: (response: any) => {
          this.newsletterMessage = 'Inscription réussie à la newsletter !';
          this.newsletterForm.reset();
          this.isSubmitting = false;
        },
        error: (error: any) => {
          this.newsletterError = error.error?.message || 'Une erreur est survenue lors de l\'inscription.';
          this.isSubmitting = false;
        }
      });
    }
  }
}
