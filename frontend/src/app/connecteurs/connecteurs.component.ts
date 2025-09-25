import { Component, OnInit } from '@angular/core';
import { ConnecteurService } from '../_services/connecteur.service';
import { ApplicationOpenSourceService } from '../_services/application-open-source.service';
import { ERPService } from '../_services/erp.service';

declare var bootstrap: any;

@Component({
  selector: 'app-connecteurs',
  templateUrl: './connecteurs.component.html',
  styleUrls: ['./connecteurs.component.css']
})
export class ConnecteursComponent implements OnInit {
  connecteurs: any[] = [];
  filteredConnecteurs: any[] = [];
  editingId: number | null = null;
  editedConnecteur: any = null;

  applications: any[] = [];
  erps: any[] = [];

  search = {
    nom: '',
    type: '',
    statut: '',
    applicationOpenSource: '',
    erp: ''
  };

  connecteurToDelete: any = null;
  deleteModal: any;

  newConnecteur: any = {
    nom: '',
    type: '',
    configuration: '',
    statut: '',
    applicationOpenSource: null,
    erp: null
  };

  addModal: any;
  selectedConfig: string = '';
  configModal: any;

  constructor(
    private connecteurService: ConnecteurService,
    private applicationOpenSourceService: ApplicationOpenSourceService,
    private erpService: ERPService
  ) {}

  ngOnInit(): void {
    this.loadConnecteurs();
    this.loadApplications();
    this.loadERPs();
    this.initializeModals();
  }

  loadConnecteurs() {
    console.log('Chargement des connecteurs...');
    this.connecteurService.getAll().subscribe({
      next: (data) => {
        console.log('Connecteurs reçus:', data);
        this.connecteurs = data;
        this.filteredConnecteurs = [...this.connecteurs];
      },
      error: (error) => {
        console.error('Erreur lors du chargement des connecteurs:', error);
      }
    });
  }

  loadApplications() {
    this.applicationOpenSourceService.getAll().subscribe({
      next: (data) => {
        this.applications = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des applications:', error);
      }
    });
  }

  loadERPs() {
    this.erpService.getAll().subscribe({
      next: (data) => {
        this.erps = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des ERPs:', error);
      }
    });
  }

  initializeModals() {
    const deleteModalElement = document.getElementById('deleteConnecteurModal');
    if (deleteModalElement) {
      this.deleteModal = new bootstrap.Modal(deleteModalElement);
    }
    
    const addModalElement = document.getElementById('addConnecteurModal');
    if (addModalElement) {
      this.addModal = new bootstrap.Modal(addModalElement);
    }
    
    const configModalElement = document.getElementById('configDetailModal');
    if (configModalElement) {
      this.configModal = new bootstrap.Modal(configModalElement);
    }
  }

  onSearch() {
    this.filteredConnecteurs = this.connecteurs.filter(c => {
      const matchNom = !this.search.nom || c.nom.toLowerCase().includes(this.search.nom.toLowerCase());
      const matchType = !this.search.type || c.type.toLowerCase().includes(this.search.type.toLowerCase());
      const matchStatut = !this.search.statut || c.statut.toLowerCase().includes(this.search.statut.toLowerCase());
      const matchApp = !this.search.applicationOpenSource || (c.applicationOpenSource && c.applicationOpenSource.nom.toLowerCase().includes(this.search.applicationOpenSource.toLowerCase()));
      const matchErp = !this.search.erp || (c.erp && c.erp.nom.toLowerCase().includes(this.search.erp.toLowerCase()));
      return matchNom && matchType && matchStatut && matchApp && matchErp;
    });
  }

  atLeastOneFilled(): boolean {
    return Object.values(this.search).some(val => val && val.trim() !== '');
  }

  resetFilters(): void {
    this.search = {
      nom: '',
      type: '',
      statut: '',
      applicationOpenSource: '',
      erp: ''
    };
    this.filteredConnecteurs = this.connecteurs;
  }

  startEditing(connecteur: any) {
    this.editingId = connecteur.id;
    this.editedConnecteur = { ...connecteur };
  }

  saveEdit() {
    if (this.editedConnecteur) {
      this.connecteurService.update(this.editedConnecteur.id, this.editedConnecteur).subscribe({
        next: () => {
          this.loadConnecteurs();
          this.editingId = null;
          this.editedConnecteur = null;
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour:', error);
        }
      });
    }
  }

  cancelEdit() {
    this.editingId = null;
    this.editedConnecteur = null;
  }

  openDeleteModal(connecteur: any) {
    this.connecteurToDelete = connecteur;
    if (this.deleteModal) {
      this.deleteModal.show();
    }
  }

  confirmDelete() {
    if (this.connecteurToDelete) {
      this.connecteurService.delete(this.connecteurToDelete.id).subscribe({
        next: () => {
          this.loadConnecteurs();
          this.deleteModal.hide();
          this.connecteurToDelete = null;
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
        }
      });
    }
  }

  cancelDelete() {
    this.connecteurToDelete = null;
    if (this.deleteModal) {
      this.deleteModal.hide();
    }
  }

  openAddModal() {
    const modalElement = document.getElementById('addConnecteurModal');
    if (modalElement) {
      this.addModal = new bootstrap.Modal(modalElement);
      this.addModal.show();
    }
  }

  submitAddConnecteur() {
    this.connecteurService.add(this.newConnecteur).subscribe({
      next: () => {
        this.loadConnecteurs();
        this.addModal.hide();
        this.newConnecteur = {
          nom: '',
          type: '',
          configuration: '',
          statut: '',
          applicationOpenSource: null,
          erp: null
        };
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout:', error);
      }
    });
  }

  cancelAddConnecteurModal() {
    if (this.addModal) {
      this.addModal.hide();
    }
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
      // Essayer de parser et formater le JSON
      const parsed = JSON.parse(config);
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      // Si ce n'est pas du JSON valide, retourner tel quel
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

    // Essayer d'utiliser l'API Clipboard moderne
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(this.selectedConfig).then(() => {
        this.showNotification('Configuration copiée dans le presse-papiers !', 'success');
        console.log('Configuration copiée dans le presse-papiers');
      }).catch(err => {
        console.error('Erreur lors de la copie:', err);
        this.fallbackCopyTextToClipboard(this.selectedConfig);
      });
    } else {
      // Fallback pour les navigateurs plus anciens
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
        console.log('Configuration copiée avec fallback');
      } else {
        this.showNotification('Impossible de copier la configuration', 'error');
        console.error('Fallback copy failed');
      }
    } catch (err) {
      this.showNotification('Erreur lors de la copie', 'error');
      console.error('Erreur lors de la copie avec fallback:', err);
    }
    
    document.body.removeChild(textArea);
  }

  // Méthode pour afficher une notification
  private showNotification(message: string, type: 'success' | 'error'): void {
    // Créer une notification temporaire
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
    
    // Supprimer automatiquement après 3 secondes
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }
}
