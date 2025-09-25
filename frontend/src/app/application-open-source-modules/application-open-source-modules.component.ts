import { Component, OnInit } from '@angular/core';
import { ApplicationOpenSourceModuleService } from '../_services/application-open-source-module.service';
import { ApplicationOpenSourceService } from '../_services/application-open-source.service';

declare var bootstrap: any;

@Component({
  selector: 'app-application-open-source-modules',
  templateUrl: './application-open-source-modules.component.html',
  styleUrls: ['./application-open-source-modules.component.css']
})
export class ApplicationOpenSourceModulesComponent implements OnInit {
  modules: any[] = [];
  filteredModules: any[] = [];
  editingId: number | null = null;
  editedModule: any = null;

  applications: any[] = [];

  search = {
    nom: '',
    typeModule: '',
    actif: ''
  };

  moduleToDelete: any = null;
  deleteModal: any;

  newModule: any = {
    nom: '',
    description: '',
    typeModule: '',
    schema: '',
    endpoints: '',
    configuration: '',
    actif: true,
    applicationOpenSource: null
  };

  addModal: any;

  // Propriétés pour le guide JSON
  showJsonGuide: boolean = false;
  currentJsonField: string = '';
  jsonTemplates: any = {};
  jsonValidationErrors: {[key: string]: string} = {};

  constructor(
    private moduleService: ApplicationOpenSourceModuleService,
    private applicationService: ApplicationOpenSourceService
  ) {}

  ngOnInit(): void {
    this.loadModules();
    this.loadApplications();
    this.initializeModals();
    this.initializeJsonTemplates();
  }

  loadModules() {
    console.log('Chargement des modules d\'applications open source...');
    this.moduleService.getAll().subscribe({
      next: (data) => {
        console.log('Modules reçus:', data);
        this.modules = data;
        this.filteredModules = [...this.modules];
      },
      error: (error) => {
        console.error('Erreur lors du chargement des modules:', error);
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
    const deleteModalElement = document.getElementById('deleteModuleModal');
    if (deleteModalElement) {
      this.deleteModal = new bootstrap.Modal(deleteModalElement);
    }
    
    const addModalElement = document.getElementById('addModuleModal');
    if (addModalElement) {
      this.addModal = new bootstrap.Modal(addModalElement);
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
    return !!(this.search.nom || this.search.typeModule || this.search.actif);
  }

  startEditing(module: any) {
    this.editingId = module.id;
    this.editedModule = { ...module };
  }

  saveEdit() {
    if (this.editedModule) {
      this.moduleService.update(this.editedModule.id, this.editedModule).subscribe({
        next: (data) => {
          console.log('Module mis à jour:', data);
          this.loadModules();
          this.editingId = null;
          this.editedModule = null;
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour:', error);
        }
      });
    }
  }

  cancelEdit() {
    this.editingId = null;
    this.editedModule = null;
  }

  openDeleteModal(module: any) {
    this.moduleToDelete = module;
    if (this.deleteModal) {
      this.deleteModal.show();
    }
  }

  confirmDelete() {
    if (this.moduleToDelete) {
      this.moduleService.delete(this.moduleToDelete.id).subscribe({
        next: () => {
          console.log('Module supprimé');
          this.loadModules();
          this.cancelDelete();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
        }
      });
    }
  }

  cancelDelete() {
    this.moduleToDelete = null;
    if (this.deleteModal) {
      this.deleteModal.hide();
    }
  }

  openAddModal() {
    if (this.addModal) {
      this.addModal.show();
    }
  }

  addModule() {
    this.moduleService.add(this.newModule).subscribe({
      next: (data) => {
        console.log('Module ajouté:', data);
        this.loadModules();
        this.cancelAddModuleModal();
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout:', error);
      }
    });
  }

  cancelAddModuleModal() {
    if (this.addModal) {
      this.addModal.hide();
    }
    this.newModule = {
      nom: '',
      description: '',
      typeModule: '',
      schema: '',
      endpoints: '',
      configuration: '',
      actif: true,
      applicationOpenSource: null
    };
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

  selectedConfig: string = '';
  configModal: any;

  // Méthode trackBy pour optimiser les performances
  trackByModuleId(index: number, module: any): any {
    return module ? module.id : index;
  }

  // Méthodes pour le guide JSON
  initializeJsonTemplates(): void {
    this.jsonTemplates = {
      schema: {
        DATA: {
          description: "Schéma pour les modules de données",
          template: `{
    "fields": [
      {
        "name": "id",
        "type": "INTEGER",
        "primary": true,
        "description": "Identifiant unique de l'enregistrement"
      },
      {
        "name": "nom",
        "type": "STRING",
        "required": true,
        "description": "Nom de l'élément"
      },
      {
        "name": "description",
        "type": "TEXT",
        "description": "Description détaillée"
      },
      {
        "name": "created_at",
        "type": "DATETIME",
        "description": "Date de création"
      },
      {
        "name": "updated_at",
        "type": "DATETIME",
        "description": "Date de dernière modification"
      }
    ]
    }`
        },
        USER: {
          description: "Schéma pour les modules utilisateurs",
          template: `{
    "fields": [
      {
        "name": "id",
        "type": "INTEGER",
        "primary": true,
        "description": "Identifiant unique de l'utilisateur"
      },
      {
        "name": "username",
        "type": "STRING",
        "required": true,
        "unique": true,
        "description": "Nom d'utilisateur"
      },
      {
        "name": "email",
        "type": "STRING",
        "required": true,
        "unique": true,
        "description": "Adresse email"
      },
      {
        "name": "nom",
        "type": "STRING",
        "required": true,
        "description": "Nom de l'utilisateur"
      },
      {
        "name": "prenom",
        "type": "STRING",
        "required": true,
        "description": "Prénom de l'utilisateur"
      },
      {
        "name": "date_creation",
        "type": "DATETIME",
        "description": "Date de création du compte"
      }
    ]
    }`
        },
        CONTENT: {
          description: "Schéma pour les modules de contenu",
          template: `{
    "fields": [
      {
        "name": "id",
        "type": "INTEGER",
        "primary": true,
        "description": "Identifiant unique du contenu"
      },
      {
        "name": "titre",
        "type": "STRING",
        "required": true,
        "description": "Titre du contenu"
      },
      {
        "name": "contenu",
        "type": "TEXT",
        "required": true,
        "description": "Contenu principal"
      },
      {
        "name": "auteur",
        "type": "STRING",
        "description": "Auteur du contenu"
      },
      {
        "name": "date_publication",
        "type": "DATETIME",
        "description": "Date de publication"
      },
      {
        "name": "statut",
        "type": "ENUM",
        "values": ["DRAFT", "PUBLISHED", "ARCHIVED"],
        "description": "Statut du contenu"
      }
    ]
    }`
        },
        API: {
          description: "Schéma pour les modules API",
          template: `{
    "fields": [
      {
        "name": "id",
        "type": "INTEGER",
        "primary": true,
        "description": "Identifiant unique de l'API"
      },
      {
        "name": "nom",
        "type": "STRING",
        "required": true,
        "description": "Nom de l'API"
      },
      {
        "name": "version",
        "type": "STRING",
        "required": true,
        "description": "Version de l'API"
      },
      {
        "name": "base_url",
        "type": "STRING",
        "required": true,
        "description": "URL de base de l'API"
      },
      {
        "name": "authentification",
        "type": "ENUM",
        "values": ["NONE", "API_KEY", "OAUTH", "JWT"],
        "description": "Type d'authentification"
      }
    ]
    }`
        }
      },
      endpoints: {
        DATA: {
          description: "Endpoints pour les modules de données",
          template: `{
    "base_url": "https://api.example.com",
    "endpoints": [
      {
        "name": "get_data",
        "path": "/data",
        "method": "GET",
        "description": "Récupérer les données"
      },
      {
        "name": "create_data",
        "path": "/data",
        "method": "POST",
        "description": "Créer de nouvelles données"
      },
      {
        "name": "update_data",
        "path": "/data/{id}",
        "method": "PUT",
        "description": "Modifier les données"
      },
      {
        "name": "delete_data",
        "path": "/data/{id}",
        "method": "DELETE",
        "description": "Supprimer les données"
      }
    ]
    }`
        },
        USER: {
          description: "Endpoints pour les modules utilisateurs",
          template: `{
    "base_url": "https://api.example.com",
    "endpoints": [
      {
        "name": "get_users",
        "path": "/users",
        "method": "GET",
        "description": "Récupérer la liste des utilisateurs"
      },
      {
        "name": "create_user",
        "path": "/users",
        "method": "POST",
        "description": "Créer un nouvel utilisateur"
      },
      {
        "name": "update_user",
        "path": "/users/{id}",
        "method": "PUT",
        "description": "Modifier un utilisateur"
      },
      {
        "name": "delete_user",
        "path": "/users/{id}",
        "method": "DELETE",
        "description": "Supprimer un utilisateur"
      }
    ]
    }`
        },
        CONTENT: {
          description: "Endpoints pour les modules de contenu",
          template: `{
    "base_url": "https://api.example.com",
    "endpoints": [
      {
        "name": "get_content",
        "path": "/content",
        "method": "GET",
        "description": "Récupérer le contenu"
      },
      {
        "name": "create_content",
        "path": "/content",
        "method": "POST",
        "description": "Créer du nouveau contenu"
      },
      {
        "name": "update_content",
        "path": "/content/{id}",
        "method": "PUT",
        "description": "Modifier le contenu"
      },
      {
        "name": "delete_content",
        "path": "/content/{id}",
        "method": "DELETE",
        "description": "Supprimer le contenu"
      }
    ]
    }`
        },
        API: {
          description: "Endpoints pour les modules API",
          template: `{
    "base_url": "https://api.example.com",
    "endpoints": [
      {
        "name": "get_api_info",
        "path": "/info",
        "method": "GET",
        "description": "Récupérer les informations de l'API"
      },
      {
        "name": "health_check",
        "path": "/health",
        "method": "GET",
        "description": "Vérifier l'état de l'API"
      },
      {
        "name": "get_documentation",
        "path": "/docs",
        "method": "GET",
        "description": "Récupérer la documentation"
      }
    ]
    }`
        }
      },
        configuration: {
                    DATA: {
                        description: "Configuration pour les modules de données (ODOO)",
                        template: `{
    "app_type": "ODOO",
    "base_url": "https://your-odoo-instance.com",
    "model": "data.model",
    "api_key": "your_odoo_api_key",
    "database": "your_database_name",
    "username": "your_username",
    "password": "your_password"
    }`
                    },
                    USER: {
                        description: "Configuration pour les modules utilisateurs (ODOO)",
                        template: `{
    "app_type": "ODOO",
    "base_url": "https://your-odoo-instance.com",
    "model": "res.users",
    "api_key": "your_odoo_api_key",
    "database": "your_database_name",
    "username": "your_username",
    "password": "your_password"
    }`
                    },
                    CONTENT: {
                        description: "Configuration pour les modules de contenu (ODOO)",
                        template: `{
    "app_type": "ODOO",
    "base_url": "https://your-odoo-instance.com",
    "model": "content.model",
    "api_key": "your_odoo_api_key",
    "database": "your_database_name",
    "username": "your_username",
    "password": "your_password"
    }`
                    },
                    API: {
                        description: "Configuration pour les modules API (REST_API)",
                        template: `{
    "app_type": "REST_API",
    "base_url": "https://api.example.com",
    "endpoints": {
      "get_info": "/info",
      "health_check": "/health",
      "get_docs": "/docs"
    },
    "auth_type": "API_KEY",
    "api_key": "your_api_key_here",
    "timeout": 30000,
    "retry_attempts": 3
    }`
                    },
                    ERPNEXT: {
                        description: "Configuration pour les modules ERPNext",
                        template: `{
    "app_type": "ERPNEXT",
    "base_url": "https://your-erpnext-instance.com",
    "api_key": "your_erpnext_api_key",
    "api_secret": "your_erpnext_api_secret",
    "username": "your_username",
    "password": "your_password"
    }`
                    },
                    PRESTASHOP: {
                        description: "Configuration pour les modules PrestaShop",
                        template: `{
    "app_type": "PRESTASHOP",
    "base_url": "https://your-prestashop.com",
    "api_key": "your_prestashop_api_key",
    "shop_url": "/api",
    "version": "1.7"
    }`
                    },
                    MAGENTO: {
                        description: "Configuration pour les modules Magento",
                        template: `{
    "app_type": "MAGENTO",
    "base_url": "https://your-magento.com",
    "api_key": "your_magento_api_key",
    "api_secret": "your_magento_api_secret",
    "version": "2.4"
    }`
                    }
                }
    };
  }

  openJsonGuide(field: string): void {
    this.currentJsonField = field;
    this.showJsonGuide = true;
  }

  closeJsonGuide(): void {
    this.showJsonGuide = false;
    this.currentJsonField = '';
  }

  getCurrentTemplate(): any {
    if (!this.currentJsonField || !this.newModule.typeModule) {
      return null;
    }
    return this.jsonTemplates[this.currentJsonField]?.[this.newModule.typeModule];
  }

  applyTemplate(): void {
    const template = this.getCurrentTemplate();
    if (template) {
      this.newModule[this.currentJsonField] = template.template;
      this.validateJson(this.currentJsonField, template.template);
      this.closeJsonGuide();
    }
  }

  validateJson(field: string, value: string): void {
    if (!value || value.trim() === '') {
      this.jsonValidationErrors[field] = '';
      return;
    }

    try {
      JSON.parse(value);
      this.jsonValidationErrors[field] = '';
    } catch (error) {
      this.jsonValidationErrors[field] = 'JSON invalide: ' + (error as Error).message;
    }
  }

  onJsonFieldChange(field: string, event: any): void {
    const value = event.target.value;
    this.validateJson(field, value);
  }

  getJsonValidationClass(field: string): string {
    const error = this.jsonValidationErrors[field];
    if (!error) return '';
    return 'is-invalid';
  }

  getJsonValidationMessage(field: string): string {
    return this.jsonValidationErrors[field] || '';
  }

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
