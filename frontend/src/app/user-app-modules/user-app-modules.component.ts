import { Component, OnInit } from '@angular/core';
import { ApplicationOpenSourceModuleService } from '../_services/application-open-source-module.service';
import { ApplicationOpenSourceService } from '../_services/application-open-source.service';

declare var bootstrap: any;

@Component({
  selector: 'app-user-app-modules',
  templateUrl: './user-app-modules.component.html',
  styleUrls: ['./user-app-modules.component.css']
})
export class UserAppModulesComponent implements OnInit {
  modules: any[] = [];
  filteredModules: any[] = [];
  loading: boolean = false;

  applications: any[] = [];

  search = {
    nom: '',
    typeModule: '',
    actif: ''
  };

  // Propriétés pour l'affichage des détails (lecture seule)
  selectedModule: any = null;
  detailModal: any;
  selectedConfig: string = '';
  configModal: any;

  constructor(
    private moduleService: ApplicationOpenSourceModuleService,
    private applicationService: ApplicationOpenSourceService
  ) {}

  ngOnInit(): void {
    this.loadModules();
    this.loadApplications();
    this.initializeModals();
  }

  loadModules() {
    this.loading = true;
    console.log('Chargement des modules d\'applications open source...');
    this.moduleService.getAll().subscribe({
      next: (data) => {
        console.log('Modules reçus:', data);
        this.modules = data;
        this.filteredModules = [...this.modules];
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des modules:', error);
        this.loading = false;
      }
    });
  }

  loadApplications() {
    this.applicationService.getAll().subscribe({
      next: (data) => {
        this.applications = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des applications:', error);
      }
    });
  }

  initializeModals() {
    const detailModalElement = document.getElementById('moduleDetailModal');
    if (detailModalElement) {
      this.detailModal = new bootstrap.Modal(detailModalElement);
    }
    
    const configModalElement = document.getElementById('configDetailModal');
    if (configModalElement) {
      this.configModal = new bootstrap.Modal(configModalElement);
    }
  }

  onSearch() {
    this.filteredModules = this.modules.filter(m => {
      const matchNom = !this.search.nom || m.nom.toLowerCase().includes(this.search.nom.toLowerCase());
      const matchType = !this.search.typeModule || m.typeModule.toLowerCase().includes(this.search.typeModule.toLowerCase());
      const matchActif = !this.search.actif || m.actif.toString() === this.search.actif;
      
      return matchNom && matchType && matchActif;
    });
  }

  atLeastOneFilled(): boolean {
    return Object.values(this.search).some(val => val && val.trim() !== '');
  }

  resetSearch(): void {
    this.search = {
      nom: '',
      typeModule: '',
      actif: ''
    };
    this.filteredModules = this.modules;
  }

  // Méthode pour obtenir un aperçu de la configuration
  getConfigPreview(config: string): string {
    if (!config) return 'Aucune configuration';
    
    try {
      const parsed = JSON.parse(config);
      const keys = Object.keys(parsed);
      if (keys.length > 0) {
        return `${keys[0]}: ${parsed[keys[0]]}`;
      }
    } catch (e) {
      // Si ce n'est pas du JSON valide, retourner les premiers caractères
    }
    
    return config.length > 30 ? config.substring(0, 30) + '...' : config;
  }

  // Méthode pour afficher la configuration complète
  showConfigDetail(config: string): void {
    this.selectedConfig = this.formatJsonConfig(config);
    this.configModal.show();
  }

  // Méthode pour formater la configuration JSON
  private formatJsonConfig(config: string): string {
    if (!config) return '';
    
    try {
      const parsed = JSON.parse(config);
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      return config;
    }
  }

  // Méthode pour fermer le modal de configuration
  closeConfigModal(): void {
    if (this.configModal) {
      this.configModal.hide();
    }
    this.selectedConfig = '';
  }

  // Méthode pour copier la configuration
  copyConfig(): void {
    if (!this.selectedConfig) {
      console.warn('Aucune configuration sélectionnée');
      return;
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(this.selectedConfig).then(() => {
        this.showNotification('Configuration copiée dans le presse-papiers !', 'success');
      }).catch(err => {
        this.fallbackCopyTextToClipboard(this.selectedConfig);
      });
    } else {
      this.fallbackCopyTextToClipboard(this.selectedConfig);
    }
  }

  // Méthode de fallback pour copier le texte
  private fallbackCopyTextToClipboard(text: string): void {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        this.showNotification('Configuration copiée dans le presse-papiers !', 'success');
      } else {
        this.showNotification('Impossible de copier la configuration', 'error');
      }
    } catch (err) {
      this.showNotification('Erreur lors de la copie', 'error');
    }
    
    document.body.removeChild(textArea);
  }

  // Méthode pour afficher une notification
  private showNotification(message: string, type: 'success' | 'error'): void {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.style.minWidth = '300px';
    
    notification.innerHTML = `
      <i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2"></i>
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }

  // Méthode pour afficher les détails d'un module
  showModuleDetails(module: any): void {
    this.selectedModule = module;
    this.detailModal.show();
  }

  // Méthode pour fermer le modal de détails
  closeDetailModal(): void {
    if (this.detailModal) {
      this.detailModal.hide();
    }
    this.selectedModule = null;
  }

  // Méthode trackBy pour optimiser les performances
  trackByModuleId(index: number, module: any): any {
    return module ? module.id : index;
  }

  // Méthodes pour formater le JSON
  formatJson(jsonString: string): string {
    if (!jsonString) return '';
    try {
      const parsed = JSON.parse(jsonString);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return jsonString;
    }
  }
}

