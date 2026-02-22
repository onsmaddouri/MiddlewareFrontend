import { Component, OnInit } from '@angular/core';
import { ERPService } from '../_services/erp.service';

declare var bootstrap: any;

@Component({
  selector: 'app-user-erp',
  templateUrl: './user-erp.component.html',
  styleUrls: ['./user-erp.component.css']
})
export class UserErpComponent implements OnInit {
  erps: any[] = [];
  filteredErps: any[] = [];
  loading: boolean = false;

  logoUrls: string[] = [];
  search = {
    nom: '',
    version: '',
    logoUrl: ''
  };

  // Propriétés pour l'affichage des détails (lecture seule)
  selectedErp: any = null;
  detailModal: any;

  constructor(private erpService: ERPService) {}

  ngOnInit(): void {
    this.loadErps();
    this.initializeModals();
  }

  loadErps() {
    this.loading = true;
    this.erpService.getAll().subscribe({
      next: (data) => {
        this.erps = data;
        this.filteredErps = data;
        this.logoUrls = Array.from(new Set(data.map(erp => erp.logoUrl).filter(url => !!url)));
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des ERP:', error);
        this.loading = false;
      }
    });
  }

  initializeModals() {
    const detailModalElement = document.getElementById('erpDetailModal');
    if (detailModalElement) {
      this.detailModal = new bootstrap.Modal(detailModalElement);
    }
  }

  onSearch() {
    this.filteredErps = this.erps.filter(erp => {
      const matchNom = !this.search.nom || (erp.nom && erp.nom.toLowerCase().includes(this.search.nom.toLowerCase()));
      const matchVersion = !this.search.version || (erp.version && erp.version.toLowerCase().includes(this.search.version.toLowerCase()));
      const matchLogo = !this.search.logoUrl || (erp.logoUrl === this.search.logoUrl);
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
    this.filteredErps = this.erps;
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

  // Méthode pour afficher les détails d'un ERP
  showErpDetails(erp: any): void {
    this.selectedErp = erp;
    this.detailModal.show();
  }

  // Méthode pour fermer le modal de détails
  closeDetailModal(): void {
    if (this.detailModal) {
      this.detailModal.hide();
    }
    this.selectedErp = null;
  }

  // Méthode trackBy pour optimiser les performances
  trackByErpId(index: number, erp: any): any {
    return erp ? erp.id : index;
  }
}

