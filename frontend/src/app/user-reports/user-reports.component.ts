import { Component, OnInit } from '@angular/core';
import { ReportService } from '../_services/report.service';

@Component({
  selector: 'app-user-reports',
  templateUrl: './user-reports.component.html',
  styleUrls: ['./user-reports.component.css']
})
export class UserReportsComponent implements OnInit {
  reports: any[] = [];
  loading: boolean = false;

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.loading = true;
    this.reportService.getAll().subscribe({
      next: (data: any[]) => {
        // Transformer les données pour correspondre au format attendu
        this.reports = data.map(report => ({
          id: report.id,
          title: report.titre || report.title,
          description: report.description,
          type: report.type,
          dateGenerated: new Date(report.dateGeneration || report.dateGenerated),
          status: report.statut || report.status
        }));
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des rapports:', error);
        this.loading = false;
      }
    });
  }

  downloadReport(report: any): void {
    this.reportService.downloadReport(report.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${report.title}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Erreur lors du téléchargement:', error);
      }
    });
  }
}
