import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API_URL = 'http://localhost:8080/api/reports/';

@Component({
  selector: 'app-user-reports',
  templateUrl: './user-reports.component.html',
  styleUrls: ['./user-reports.component.css']
})
export class UserReportsComponent implements OnInit {
  fluxList: any[] = [];
  selectedFlux: any = null;
  selectedReport: any = null;
  loading: boolean = false;
  loadingReport: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadFluxList();
  }

  loadFluxList(): void {
    this.loading = true;
    this.http.get<any[]>(API_URL + 'flux').subscribe({
      next: (data: any[]) => {
        this.fluxList = data;
        this.loading = false;
        console.log('Liste des flux chargée:', this.fluxList);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des flux:', error);
        this.loading = false;
      }
    });
  }

  showFluxReport(flux: any): void {
    this.loadingReport = true;
    this.selectedFlux = flux;
    
    this.http.get<any>(API_URL + 'flux/' + flux.fluxId).subscribe({
      next: (report: any) => {
        this.selectedReport = report;
        this.loadingReport = false;
        console.log('Rapport chargé:', report);
      },
      error: (error) => {
        console.error('Erreur lors du chargement du rapport:', error);
        this.loadingReport = false;
      }
    });
  }

  closeReport(): void {
    this.selectedReport = null;
    this.selectedFlux = null;
  }

  downloadPDF(fluxId: number, fluxName: string): void {
    this.http.get(API_URL + 'flux/' + fluxId + '/pdf', { 
      responseType: 'blob' 
    }).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `rapport_${fluxName}_${fluxId}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Erreur lors du téléchargement du PDF:', error);
        alert('Erreur lors du téléchargement du PDF');
      }
    });
  }

  getSuccessRateClass(rate: number): string {
    if (rate >= 80) return 'text-success';
    if (rate >= 50) return 'text-warning';
    return 'text-danger';
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'SUCCES': return 'badge-success';
      case 'ERREUR': return 'badge-danger';
      case 'EN_COURS': return 'badge-info';
      case 'EN_ATTENTE': return 'badge-warning';
      case 'ACTIF': return 'badge-primary';
      default: return 'badge-secondary';
    }
  }
}
