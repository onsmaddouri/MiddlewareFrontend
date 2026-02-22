import { Component, OnInit } from '@angular/core';
import { LogService } from '../_services/log.service';

declare var bootstrap: any;

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {
  logs: any[] = [];
  filteredLogs: any[] = [];
  loading: boolean = false;
  selectedLog: any = null;
  logDetailsModal: any;

  search = {
    level: '',
    source: '',
    date: ''
  };

  levels = ['ERROR', 'WARN', 'INFO'];

  constructor(private logService: LogService) {}

  ngOnInit(): void {
    this.loadLogs();
    
    // Initialiser le modal
    const modalElement = document.getElementById('logDetailsModal');
    if (modalElement) {
      this.logDetailsModal = new bootstrap.Modal(modalElement);
    }
  }

  loadLogs(): void {
    this.loading = true;
    this.logService.getAll().subscribe({
      next: (data: any[]) => {
        // Transformer les données pour correspondre au format attendu
        this.logs = data.map(log => ({
          id: log.id,
          timestamp: log.dateCreation ? new Date(log.dateCreation) : new Date(),
          level: log.niveauLog || 'INFO',
          source: log.typeAction || 'SYSTEM',
          message: log.message || '',
          details: log.details || log.message || 'Aucun détail'
        }));
        this.filteredLogs = [...this.logs];
        this.loading = false;
        console.log('Logs chargés:', this.logs);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des logs:', error);
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.filteredLogs = this.logs.filter(log => {
      const matchLevel = !this.search.level || log.level === this.search.level;
      const matchSource = !this.search.source || log.source.toLowerCase().includes(this.search.source.toLowerCase());
      const matchDate = !this.search.date || log.timestamp.toISOString().split('T')[0] === this.search.date;
      return matchLevel && matchSource && matchDate;
    });
  }

  atLeastOneFilled(): boolean {
    return Object.values(this.search).some(val => val && val.trim() !== '');
  }

  getLogLevelClass(level: string): string {
    switch (level) {
      case 'ERROR': return 'text-danger';
      case 'WARN': return 'text-warning';
      case 'INFO': return 'text-info';
      case 'DEBUG': return 'text-secondary';
      default: return 'text-secondary';
    }
  }

  getLogLevelBadgeClass(level: string): string {
    switch (level) {
      case 'ERROR': return 'badge-danger';
      case 'WARN': return 'badge-warning';
      case 'INFO': return 'badge-info';
      case 'DEBUG': return 'badge-secondary';
      default: return 'badge-secondary';
    }
  }

  showLogDetails(log: any): void {
    this.selectedLog = log;
    if (this.logDetailsModal) {
      this.logDetailsModal.show();
    }
  }

  closeLogDetails(): void {
    if (this.logDetailsModal) {
      this.logDetailsModal.hide();
    }
    this.selectedLog = null;
  }

  formatDetails(details: string): string {
    if (!details) return 'Aucun détail';
    
    // Si c'est du JSON, le formater
    try {
      const parsed = JSON.parse(details);
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      // Si ce n'est pas du JSON, retourner tel quel
      return details;
    }
  }
}
