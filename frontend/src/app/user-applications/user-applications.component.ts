import { Component, OnInit } from '@angular/core';
import { ApplicationOpenSourceService } from '../_services/application-open-source.service';

declare var bootstrap: any;

@Component({
  selector: 'app-user-applications',
  templateUrl: './user-applications.component.html',
  styleUrls: ['./user-applications.component.css']
})
export class UserApplicationsComponent implements OnInit {
  applications: any[] = [];
  filteredApplications: any[] = [];
  loading: boolean = false;

  logoUrls: string[] = [];

  search = {
    nom: '',
    version: '',
    logoUrl: ''
  };

  // Propriétés pour l'affichage des détails (lecture seule)
  selectedApplication: any = null;
  detailModal: any;

  constructor(private appService: ApplicationOpenSourceService) {}

  ngOnInit(): void {
    this.loadApplications();
    this.initializeModals();
  }

  loadApplications() {
    this.loading = true;
    console.log('Chargement des applications...');
    this.appService.getAll().subscribe({
      next: (data) => {
        console.log('Applications reçues:', data);
        this.applications = data;
        this.filteredApplications = data;
        this.logoUrls = Array.from(new Set(data.map(app => app.logoUrl).filter(url => !!url)));
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des applications:', error);
        this.loading = false;
      }
    });
  }

  initializeModals() {
    const detailModalElement = document.getElementById('applicationDetailModal');
    if (detailModalElement) {
      this.detailModal = new bootstrap.Modal(detailModalElement);
    }
  }

  onSearch() {
    this.filteredApplications = this.applications.filter(app => {
      const matchNom = !this.search.nom || (app.nom && app.nom.toLowerCase().includes(this.search.nom.toLowerCase()));
      const matchVersion = !this.search.version || (app.version && app.version.toLowerCase().includes(this.search.version.toLowerCase()));
      const matchLogo = !this.search.logoUrl || (app.logoUrl === this.search.logoUrl);
      return matchNom && matchVersion && matchLogo;
    });
  }

  atLeastOneFilled(): boolean {
    return Object.values(this.search).some(val => val && val.trim() !== '');
  }

  resetFilters(): void {
    this.search = {
      nom: '',
      version: '',
      logoUrl: ''
    };
    this.filteredApplications = this.applications;
  }

  // Méthode pour obtenir un nom lisible à partir de l'URL du logo
  getLogoName(url: string): string {
    if (!url) return '';
    
    // Extraire le nom du fichier ou du domaine
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const filename = pathname.split('/').pop();
      
      if (filename && filename.includes('.')) {
        return filename.split('.')[0];
      }
      
      // Si c'est un service comme placeholder, extraire le texte
      if (url.includes('placeholder.com')) {
        const match = url.match(/text=([^&]+)/);
        if (match) {
          return decodeURIComponent(match[1]);
        }
      }
      
      // Retourner le nom de domaine
      return urlObj.hostname.replace('www.', '');
    } catch (e) {
      // Si ce n'est pas une URL valide, retourner les premiers caractères
      return url.length > 20 ? url.substring(0, 20) + '...' : url;
    }
  }

  // Méthode pour afficher les détails d'une application
  showApplicationDetails(app: any): void {
    this.selectedApplication = app;
    this.detailModal.show();
  }

  // Méthode pour fermer le modal de détails
  closeDetailModal(): void {
    if (this.detailModal) {
      this.detailModal.hide();
    }
    this.selectedApplication = null;
  }

  // Méthode trackBy pour optimiser les performances
  trackByApplicationId(index: number, app: any): any {
    return app ? app.id : index;
  }
}

