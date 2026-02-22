import { Component, OnInit } from '@angular/core';
import { ConnecteurService } from '../_services/connecteur.service';
import { ApplicationOpenSourceService } from '../_services/application-open-source.service';
import { ERPService } from '../_services/erp.service';
import { GuideService, ConnectorGuide } from '../_services/guide.service';

declare var bootstrap: any;

@Component({
  selector: 'app-connecteurs',
  templateUrl: './connecteurs.component.html',
  styleUrls: ['./connecteurs.component.css']
})
export class ConnecteursComponent implements OnInit {
  connecteurs: any[] = [];
  filteredConnecteurs: any[] = [];
  loading: boolean = false;
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
    urlEndpoint: '',
    protocole: '',
    authentification: '',
    credentials: '',
    timeout: 30000,
    maxRetries: 3,
    versionConnecteur: '1.0',
    applicationOpenSource: null,
    erp: null
  };

  addModal: any;
  selectedConfig: string = '';
  configModal: any;
  
  // Guide properties
  selectedConnectorType: string = '';
  configGuideModal: any;
  currentGuide: ConnectorGuide | undefined;

  constructor(
    private connecteurService: ConnecteurService,
    private applicationOpenSourceService: ApplicationOpenSourceService,
    private erpService: ERPService,
    private guideService: GuideService
  ) {}

  ngOnInit(): void {
    this.loadConnecteurs();
    this.loadApplications();
    this.loadERPs();
    this.initializeModals();
  }

  loadConnecteurs() {
    this.loading = true;
    console.log('Chargement des connecteurs...');
    this.connecteurService.getAll().subscribe({
      next: (data) => {
        console.log('Connecteurs reçus:', data);
        this.connecteurs = data;
        this.filteredConnecteurs = [...this.connecteurs];
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des connecteurs:', error);
        this.loading = false;
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
    
    const configGuideModalElement = document.getElementById('configGuideModal');
    if (configGuideModalElement) {
      this.configGuideModal = new bootstrap.Modal(configGuideModalElement);
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

  // ==================== MÉTHODES POUR LES GUIDES ====================

  /**
   * Gère le changement de type de connecteur
   */
  onTypeChange(): void {
    if (this.newConnecteur.type === 'REST_API') {
      // Configuration par défaut pour REST API (Dancescape)
      this.newConnecteur.protocole = 'HTTPS';
      this.newConnecteur.authentification = 'Bearer';
      this.newConnecteur.timeout = 30000;
      this.newConnecteur.maxRetries = 3;
      this.newConnecteur.versionConnecteur = '1.0';
      
      // Pré-remplir l'URL si vide
      if (!this.newConnecteur.urlEndpoint) {
        this.newConnecteur.urlEndpoint = 'http://localhost:8081';
      }
      
      // Configuration JSON par défaut pour Dancescape
      if (!this.newConnecteur.configuration) {
        this.newConnecteur.configuration = JSON.stringify({
          "base_url": "http://localhost:8081",
          "auth_type": "Bearer",
          "endpoints": {
            "login": "/auth/login",
            "competitions": "/competition",
            "dancers": "/dancer",
            "trainings": "/training",
            "products": "/product",
            "events": "/event",
            "accounts": "/account"
          },
          "headers": {
            "Content-Type": "application/json",
            "Authorization": "Bearer {token}"
          }
        }, null, 2);
      }
    } else if (this.newConnecteur.type === 'DATABASE') {
      this.newConnecteur.protocole = '';
      this.newConnecteur.authentification = '';
      this.newConnecteur.timeout = 30000;
      this.newConnecteur.maxRetries = 3;
    } else if (this.newConnecteur.type === 'FTP_SFTP') {
      this.newConnecteur.protocole = 'SFTP';
      this.newConnecteur.authentification = 'Basic';
      this.newConnecteur.timeout = 60000;
      this.newConnecteur.maxRetries = 3;
    }
  }


  /**
   * Affiche le guide de configuration pour le type de connecteur sélectionné
   */
  showConfigGuide(): void {
    if (!this.newConnecteur.type) {
      this.showNotification('Veuillez d\'abord sélectionner un type de connecteur', 'error');
      return;
    }

    this.selectedConnectorType = this.newConnecteur.type;
    this.currentGuide = this.guideService.getGuide(this.selectedConnectorType);
    
    if (this.currentGuide) {
      this.displayGuide(this.currentGuide);
      this.configGuideModal.show();
    } else {
      this.showNotification('Guide non disponible pour ce type de connecteur', 'error');
    }
  }

  /**
   * Affiche le guide de configuration pour un connecteur en édition
   */
  showEditConfigGuide(): void {
    if (!this.editedConnecteur || !this.editedConnecteur.type) {
      this.showNotification('Aucun connecteur en cours d\'édition', 'error');
      return;
    }

    this.selectedConnectorType = this.editedConnecteur.type;
    this.currentGuide = this.guideService.getGuide(this.selectedConnectorType);
    
    if (this.currentGuide) {
      this.displayGuide(this.currentGuide);
      this.configGuideModal.show();
    } else {
      this.showNotification('Guide non disponible pour ce type de connecteur', 'error');
    }
  }

  /**
   * Affiche le contenu du guide dans la modal
   */
  private displayGuide(guide: ConnectorGuide): void {
    const guideContent = document.getElementById('guideContent');
    if (guideContent) {
      guideContent.innerHTML = `
        <div class="row">
          <div class="col-md-6">
            <h6><i class="bi bi-info-circle me-2"></i>Description</h6>
            <p class="text-muted">${guide.description}</p>
            
            <h6><i class="bi bi-github me-2"></i>Documentation Git</h6>
            <a href="${guide.gitLink}" target="_blank" class="btn btn-outline-secondary btn-sm mb-3">
              <i class="bi bi-github"></i> Voir sur GitHub
            </a>
            
            <h6><i class="bi bi-database me-2"></i>Champs du Modèle</h6>
            <pre class="bg-light p-3 rounded"><code>${JSON.stringify(guide.modelFields, null, 2)}</code></pre>
            
            <h6 class="mt-3"><i class="bi bi-gear me-2"></i>Configuration JSON</h6>
            <pre class="bg-light p-3 rounded"><code>${JSON.stringify(guide.configTemplate, null, 2)}</code></pre>
            
            <div class="alert alert-info mt-3">
              <i class="bi bi-lightbulb"></i>
              <strong>Astuce :</strong> Copiez le template et modifiez les valeurs selon votre configuration.
            </div>
          </div>
          
          <div class="col-md-6">
            <h6><i class="bi bi-lightbulb me-2"></i>Exemples</h6>
            ${guide.examples.map(example => `
              <div class="card mb-3">
                <div class="card-header d-flex justify-content-between align-items-center">
                  <strong>${example.name}</strong>
                  <button type="button" class="btn btn-sm btn-outline-primary" onclick="window.applyExample('${example.name}')">
                    <i class="bi bi-clipboard"></i> Copier
                  </button>
                </div>
                <div class="card-body">
                  ${example.description ? `<p class="text-muted small mb-2">${example.description}</p>` : ''}
                  <h6 class="text-primary small">Champs Modèle:</h6>
                  <pre class="mb-2 small"><code>${JSON.stringify(example.modelFields, null, 2)}</code></pre>
                  <h6 class="text-primary small">Config JSON:</h6>
                  <pre class="mb-0 small"><code>${JSON.stringify(example.config, null, 2)}</code></pre>
                </div>
              </div>
            `).join('')}
            
            ${guide.validationRules ? `
              <div class="alert alert-warning mt-3">
                <h6><i class="bi bi-exclamation-triangle me-2"></i>Règles de Validation</h6>
                <ul class="mb-0">
                  ${guide.validationRules.required ? `<li><strong>Champs requis :</strong> ${guide.validationRules.required.join(', ')}</li>` : ''}
                  ${guide.validationRules.urlEndpoint ? `<li><strong>URL :</strong> ${guide.validationRules.urlEndpoint.message}</li>` : ''}
                  ${guide.validationRules.timeout ? `<li><strong>Timeout :</strong> ${guide.validationRules.timeout.message}</li>` : ''}
                </ul>
              </div>
            ` : ''}
          </div>
        </div>
      `;

      // Ajouter les fonctions globales pour les exemples
      (window as any).applyExample = (exampleName: string) => {
        const example = guide.examples.find(ex => ex.name === exampleName);
        if (example) {
          this.applyExample(example);
        }
      };
    }
  }

  /**
   * Applique le template de base au champ configuration
   */
  applyTemplate(): void {
    if (this.currentGuide) {
      // Appliquer les champs du modèle
      Object.assign(this.newConnecteur, this.currentGuide.modelFields);
      
      // Appliquer la configuration JSON
      this.newConnecteur.configuration = JSON.stringify(this.currentGuide.configTemplate, null, 2);
      
      this.showNotification('Template complet appliqué avec succès', 'success');
      this.configGuideModal.hide();
    }
  }

  /**
   * Applique un exemple complet (modèle + configuration)
   */
  applyExample(example: any): void {
    // Appliquer les champs du modèle de l'exemple
    Object.assign(this.newConnecteur, example.modelFields);
    
    // Appliquer la configuration JSON de l'exemple
    this.newConnecteur.configuration = JSON.stringify(example.config, null, 2);
    
    this.showNotification('Exemple complet appliqué avec succès', 'success');
    this.configGuideModal.hide();
  }

  /**
   * Valide la configuration JSON selon les règles du backend
   */
  validateConfiguration(): boolean {
    const errors: string[] = [];

    // Validation des champs requis (selon ConnecteurValidator.java)
    if (!this.newConnecteur.nom || this.newConnecteur.nom.trim() === '') {
      errors.push('Le nom du connecteur est obligatoire');
    }
    
    if (!this.newConnecteur.type || this.newConnecteur.type.trim() === '') {
      errors.push('Le type de connecteur est obligatoire');
    }
    
    if (!this.newConnecteur.configuration || this.newConnecteur.configuration.trim() === '') {
      errors.push('La configuration du connecteur est obligatoire');
    } else {
      // Validation spécifique selon le type
      try {
        const config = JSON.parse(this.newConnecteur.configuration);
        this.validateConfigByType(this.newConnecteur.type, config, errors);
      } catch (error) {
        errors.push('Configuration JSON invalide: ' + error);
      }
    }

    // Validation des paramètres de performance
    if (this.newConnecteur.timeout != null && this.newConnecteur.timeout <= 0) {
      errors.push('Le timeout doit être positif');
    }
    
    if (this.newConnecteur.maxRetries != null && this.newConnecteur.maxRetries < 0) {
      errors.push('Le nombre de tentatives ne peut pas être négatif');
    }

    if (errors.length > 0) {
      this.showNotification('Erreurs de validation: ' + errors.join(', '), 'error');
      return false;
    }

    return true;
  }

  /**
   * Valide la configuration selon le type de connecteur (selon ConnecteurValidator.java)
   */
  private validateConfigByType(type: string, config: any, errors: string[]): void {
    switch (type) {
      case 'REST_API':
        this.validateRestApiConfig(config, errors);
        break;
      case 'SOAP':
        this.validateSoapConfig(config, errors);
        break;
      case 'DATABASE':
        this.validateDatabaseConfig(config, errors);
        break;
      case 'FTP_SFTP':
        this.validateFtpConfig(config, errors);
        break;
      default:
        // Pour les autres types, validation basique
        break;
    }
  }

  private validateRestApiConfig(config: any, errors: string[]): void {
    if (!config.base_url) {
      errors.push('base_url est obligatoire pour les connecteurs REST API');
    }
    if (!config.auth_type) {
      errors.push('auth_type est obligatoire pour les connecteurs REST API');
    }
    
    if (config.auth_type === 'API_KEY' && !config.api_key) {
      errors.push('api_key est obligatoire pour l\'authentification API_KEY');
    }
    if (config.auth_type === 'BASIC' && (!config.username || !config.password)) {
      errors.push('username et password sont obligatoires pour l\'authentification BASIC');
    }
  }

  private validateSoapConfig(config: any, errors: string[]): void {
    if (!config.wsdl_url) {
      errors.push('wsdl_url est obligatoire pour les connecteurs SOAP');
    }
    if (!config.service_name) {
      errors.push('service_name est obligatoire pour les connecteurs SOAP');
    }
    if (!config.operation_name) {
      errors.push('operation_name est obligatoire pour les connecteurs SOAP');
    }
  }

  private validateDatabaseConfig(config: any, errors: string[]): void {
    if (!config.jdbc_url) {
      errors.push('jdbc_url est obligatoire pour les connecteurs Database');
    }
    if (!config.username || !config.password) {
      errors.push('username et password sont obligatoires pour les connecteurs Database');
    }
  }

  private validateFtpConfig(config: any, errors: string[]): void {
    if (!config.host) {
      errors.push('host est obligatoire pour les connecteurs FTP/SFTP');
    }
    if (!config.username || !config.password) {
      errors.push('username et password sont obligatoires pour les connecteurs FTP/SFTP');
    }
    if (!config.remote_path) {
      errors.push('remote_path est obligatoire pour les connecteurs FTP/SFTP');
    }
  }

  /**
   * Met à jour la méthode submitAddConnecteur pour inclure la validation
   */
  submitAddConnecteur(): void {
    if (!this.validateConfiguration()) {
      return;
    }

    // Préparer les données pour l'envoi (corriger les chaînes vides et le type)
    const connecteurData = {
      ...this.newConnecteur,
      // Convertir les chaînes vides en null pour les objets
      applicationOpenSource: this.newConnecteur.applicationOpenSource === '' || 
                           this.newConnecteur.applicationOpenSource === null ? 
                           null : this.newConnecteur.applicationOpenSource,
      erp: this.newConnecteur.erp === '' || 
           this.newConnecteur.erp === null ? 
           null : this.newConnecteur.erp,
      // Le type est déjà correct car c'est un enum côté backend
      type: this.newConnecteur.type
    };

    console.log('📤 Données envoyées au serveur:', connecteurData);

    this.connecteurService.add(connecteurData).subscribe({
      next: (response) => {
        console.log('✅ Connecteur ajouté avec succès:', response);
        this.loadConnecteurs();
        this.addModal.hide();
        this.newConnecteur = {
          nom: '',
          type: '',
          configuration: '',
          statut: '',
          urlEndpoint: '',
          protocole: '',
          authentification: '',
          credentials: '',
          timeout: 30000,
          maxRetries: 3,
          versionConnecteur: '1.0',
          applicationOpenSource: null,
          erp: null
        };
        this.showNotification('Connecteur ajouté avec succès', 'success');
      },
      error: (error) => {
        console.error('❌ Erreur détaillée lors de l\'ajout:', error);
        console.error('❌ Status:', error.status);
        console.error('❌ Message:', error.message);
        console.error('❌ Error body:', error.error);
        
        let errorMessage = 'Erreur lors de l\'ajout du connecteur';
        if (error.error && error.error.message) {
          errorMessage += ': ' + error.error.message;
        } else if (error.message) {
          errorMessage += ': ' + error.message;
        } else if (error.status === 404) {
          errorMessage += ': Endpoint non trouvé (vérifiez que le serveur backend est démarré)';
        } else if (error.status === 500) {
          errorMessage += ': Erreur serveur (vérifiez les logs du backend)';
        }
        
        this.showNotification(errorMessage, 'error');
      }
    });
  }
}
