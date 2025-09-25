import { Component, OnInit } from '@angular/core';
import { ERPModuleService } from '../_services/erp-module.service';
import { ERPService } from '../_services/erp.service';

declare var bootstrap: any;

@Component({
  selector: 'app-erp-modules',
  templateUrl: './erp-modules.component.html',
  styleUrls: ['./erp-modules.component.css']
})
export class ERPModulesComponent implements OnInit {
  modules: any[] = [];
  filteredModules: any[] = [];
  editingId: number | null = null;
  editedModule: any = null;

  erps: any[] = [];

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
    erp: null
  };

  addModal: any;

  // Propriétés pour le guide JSON
  showJsonGuide: boolean = false;
  currentJsonField: string = '';
  jsonTemplates: any = {};
  jsonValidationErrors: {[key: string]: string} = {};

  constructor(
    private moduleService: ERPModuleService,
    private erpService: ERPService
  ) {}

  ngOnInit(): void {
    this.loadModules();
    this.loadERPs();
    this.initializeModals();
    this.initializeJsonTemplates();
  }

  loadModules() {
    console.log('Chargement des modules ERP...');
    this.moduleService.getAll().subscribe({
      next: (data) => {
        console.log('Modules ERP reçus:', data);
        this.modules = data;
        this.filteredModules = [...this.modules];
      },
      error: (error) => {
        console.error('Erreur lors du chargement des modules ERP:', error);
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
    const deleteModalElement = document.getElementById('deleteERPModuleModal');
    if (deleteModalElement) {
      this.deleteModal = new bootstrap.Modal(deleteModalElement);
    }
    
    const addModalElement = document.getElementById('addERPModuleModal');
    if (addModalElement) {
      this.addModal = new bootstrap.Modal(addModalElement);
    }

    const configModalElement = document.getElementById('configModal');
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
          console.log('Module ERP mis à jour:', data);
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
          console.log('Module ERP supprimé');
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
        console.log('Module ERP ajouté:', data);
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
      erp: null
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
        COMPETITION: {
          description: "Schéma pour les modules de compétition",
          template: `{
  "fields": [
    {
      "name": "id",
      "type": "INTEGER",
      "primary": true,
      "description": "Identifiant unique de la compétition"
    },
    {
      "name": "nom_competition",
      "type": "STRING",
      "required": true,
      "description": "Nom de la compétition"
    },
    {
      "name": "date_debut",
      "type": "DATE",
      "required": true,
      "description": "Date de début de la compétition"
    },
    {
      "name": "date_fin",
      "type": "DATE",
      "required": true,
      "description": "Date de fin de la compétition"
    },
    {
      "name": "frais_participant",
      "type": "DECIMAL",
      "description": "Frais de participation"
    }
  ]
}`
        },
        PRODUCT: {
          description: "Schéma pour les modules de produits",
          template: `{
  "fields": [
    {
      "name": "id",
      "type": "INTEGER",
      "primary": true,
      "description": "Identifiant unique du produit"
    },
    {
      "name": "titre",
      "type": "STRING",
      "required": true,
      "description": "Titre du produit"
    },
    {
      "name": "description",
      "type": "TEXT",
      "description": "Description détaillée du produit"
    },
    {
      "name": "prix",
      "type": "DECIMAL",
      "required": true,
      "description": "Prix du produit"
    },
    {
      "name": "quantite",
      "type": "INTEGER",
      "description": "Quantité en stock"
    }
  ]
}`
        },
        TRAINING: {
          description: "Schéma pour les modules de formation",
          template: `{
  "fields": [
    {
      "name": "id",
      "type": "INTEGER",
      "primary": true,
      "description": "Identifiant unique de la formation"
    },
    {
      "name": "nom_formation",
      "type": "STRING",
      "required": true,
      "description": "Nom de la formation"
    },
    {
      "name": "description",
      "type": "TEXT",
      "description": "Description de la formation"
    },
    {
      "name": "date_debut",
      "type": "DATE",
      "required": true,
      "description": "Date de début de la formation"
    },
    {
      "name": "date_fin",
      "type": "DATE",
      "required": true,
      "description": "Date de fin de la formation"
    },
    {
      "name": "capacite",
      "type": "INTEGER",
      "description": "Capacité maximale de participants"
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
        }
      },
      endpoints: {
        COMPETITION: {
          description: "Endpoints pour les modules de compétition",
          template: `{
  "base_url": "https://api.example.com",
  "endpoints": [
    {
      "name": "get_competitions",
      "path": "/competitions",
      "method": "GET",
      "description": "Récupérer la liste des compétitions"
    },
    {
      "name": "create_competition",
      "path": "/competitions",
      "method": "POST",
      "description": "Créer une nouvelle compétition"
    },
    {
      "name": "update_competition",
      "path": "/competitions/{id}",
      "method": "PUT",
      "description": "Modifier une compétition"
    },
    {
      "name": "delete_competition",
      "path": "/competitions/{id}",
      "method": "DELETE",
      "description": "Supprimer une compétition"
    }
  ]
}`
        },
        PRODUCT: {
          description: "Endpoints pour les modules de produits",
          template: `{
  "base_url": "https://api.example.com",
  "endpoints": [
    {
      "name": "get_products",
      "path": "/products",
      "method": "GET",
      "description": "Récupérer la liste des produits"
    },
    {
      "name": "create_product",
      "path": "/products",
      "method": "POST",
      "description": "Créer un nouveau produit"
    },
    {
      "name": "update_product",
      "path": "/products/{id}",
      "method": "PUT",
      "description": "Modifier un produit"
    },
    {
      "name": "delete_product",
      "path": "/products/{id}",
      "method": "DELETE",
      "description": "Supprimer un produit"
    }
  ]
}`
        },
        TRAINING: {
          description: "Endpoints pour les modules de formation",
          template: `{
  "base_url": "https://api.example.com",
  "endpoints": [
    {
      "name": "get_trainings",
      "path": "/trainings",
      "method": "GET",
      "description": "Récupérer la liste des formations"
    },
    {
      "name": "create_training",
      "path": "/trainings",
      "method": "POST",
      "description": "Créer une nouvelle formation"
    },
    {
      "name": "update_training",
      "path": "/trainings/{id}",
      "method": "PUT",
      "description": "Modifier une formation"
    },
    {
      "name": "delete_training",
      "path": "/trainings/{id}",
      "method": "DELETE",
      "description": "Supprimer une formation"
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
        }
      },
      configuration: {
        COMPETITION: {
          description: "Configuration pour les modules de compétition (DATABASE)",
          template: `{
  "connection_type": "DATABASE",
  "table_name": "competition",
  "extract_query": "SELECT * FROM competition WHERE status = 'ACTIVE'",
  "insert_query": "INSERT INTO competition (compname, startdate, enddate, feesperparticipant) VALUES (?, ?, ?, ?)",
  "update_query": "UPDATE competition SET compname = ?, startdate = ?, enddate = ?, feesperparticipant = ? WHERE id = ?",
  "delete_query": "DELETE FROM competition WHERE id = ?"
}`
        },
        PRODUCT: {
          description: "Configuration pour les modules de produits (DATABASE)",
          template: `{
  "connection_type": "DATABASE",
  "table_name": "product",
  "extract_query": "SELECT * FROM product WHERE status = 'ACTIVE'",
  "insert_query": "INSERT INTO product (title, description, price, quantity) VALUES (?, ?, ?, ?)",
  "update_query": "UPDATE product SET title = ?, description = ?, price = ?, quantity = ? WHERE id = ?",
  "delete_query": "DELETE FROM product WHERE id = ?"
}`
        },
        TRAINING: {
          description: "Configuration pour les modules de formation (DATABASE)",
          template: `{
  "connection_type": "DATABASE",
  "table_name": "training",
  "extract_query": "SELECT * FROM training WHERE status = 'ACTIVE'",
  "insert_query": "INSERT INTO training (training_name, description, start, end, capacity) VALUES (?, ?, ?, ?, ?)",
  "update_query": "UPDATE training SET training_name = ?, description = ?, start = ?, end = ?, capacity = ? WHERE id = ?",
  "delete_query": "DELETE FROM training WHERE id = ?"
}`
        },
        USER: {
          description: "Configuration pour les modules utilisateurs (DATABASE)",
          template: `{
  "connection_type": "DATABASE",
  "table_name": "users",
  "extract_query": "SELECT * FROM users WHERE status = 'ACTIVE'",
  "insert_query": "INSERT INTO users (username, email, nom, prenom) VALUES (?, ?, ?, ?)",
  "update_query": "UPDATE users SET username = ?, email = ?, nom = ?, prenom = ? WHERE id = ?",
  "delete_query": "DELETE FROM users WHERE id = ?"
}`
        },
        DATA: {
          description: "Configuration pour les modules de données (DATABASE)",
          template: `{
  "connection_type": "DATABASE",
  "table_name": "test_data",
  "extract_query": "SELECT * FROM test_data WHERE status = 'ACTIVE'",
  "insert_query": "INSERT INTO test_data (nom, description) VALUES (?, ?)",
  "update_query": "UPDATE test_data SET nom = ?, description = ? WHERE id = ?",
  "delete_query": "DELETE FROM test_data WHERE id = ?"
}`
        },
        REST_API: {
          description: "Configuration pour les modules REST API",
          template: `{
  "connection_type": "REST_API",
  "base_url": "https://api.example.com",
  "extract_endpoint": "/api/data",
  "insert_endpoint": "/api/data",
  "auth_type": "API_KEY",
  "api_key": "your_api_key_here",
  "headers": {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
}`
        },
        SOAP: {
          description: "Configuration pour les modules SOAP",
          template: `{
  "connection_type": "SOAP",
  "base_url": "https://api.example.com/soap",
  "soap_action": "http://example.com/GetData",
  "operation_name": "GetData",
  "auth_type": "BASIC",
  "username": "your_username",
  "password": "your_password",
  "soap_headers": {
    "CustomHeader": "value"
  }
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
