import { Component, OnInit } from '@angular/core';
import { ErrorService } from '../_services/error.service';

@Component({
  selector: 'app-error-management',
  templateUrl: './error-management.component.html',
  styleUrls: ['./error-management.component.css']
})
export class ErrorManagementComponent implements OnInit {
  errors: any[] = [];
  filteredErrors: any[] = [];
  loading: boolean = false;

  search = {
    code: '',
    severity: '',
    status: ''
  };

  severities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
  statuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

  constructor(private errorService: ErrorService) {}

  ngOnInit(): void {
    this.loadErrors();
  }

  loadErrors(): void {
    this.loading = true;
    this.errorService.getAll().subscribe({
      next: (data: any[]) => {
        // Transformer les données pour correspondre au format attendu
        this.errors = data.map(error => ({
          id: error.id,
          code: error.codeErreur || error.code,
          title: error.titre || error.title,
          description: error.description,
          severity: error.gravite || error.severity,
          status: error.statut || error.status,
          dateDetected: new Date(error.dateDetection || error.dateDetected),
          fluxConcerne: error.fluxConcerne || error.fluxId,
          resolution: error.resolution || error.solution
        }));
        this.filteredErrors = [...this.errors];
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des erreurs:', error);
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.filteredErrors = this.errors.filter(error => {
      const matchCode = !this.search.code || error.code.toLowerCase().includes(this.search.code.toLowerCase());
      const matchSeverity = !this.search.severity || error.severity === this.search.severity;
      const matchStatus = !this.search.status || error.status === this.search.status;
      return matchCode && matchSeverity && matchStatus;
    });
  }

  atLeastOneFilled(): boolean {
    return Object.values(this.search).some(val => val && val.trim() !== '');
  }

  updateErrorStatus(error: any, newStatus: string): void {
    this.errorService.updateStatus(error.id, newStatus).subscribe({
      next: (response) => {
        error.status = newStatus;
        if (newStatus === 'RESOLVED' || newStatus === 'CLOSED') {
          error.resolution = 'Résolu automatiquement';
        }
        console.log(`Statut mis à jour pour ${error.code}: ${newStatus}`);
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du statut:', err);
      }
    });
  }

  getSeverityClass(severity: string): string {
    switch (severity) {
      case 'CRITICAL': return 'badge-danger';
      case 'HIGH': return 'badge-warning';
      case 'MEDIUM': return 'badge-info';
      case 'LOW': return 'badge-secondary';
      default: return 'badge-secondary';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'OPEN': return 'badge-danger';
      case 'IN_PROGRESS': return 'badge-warning';
      case 'RESOLVED': return 'badge-success';
      case 'CLOSED': return 'badge-secondary';
      default: return 'badge-secondary';
    }
  }
}
