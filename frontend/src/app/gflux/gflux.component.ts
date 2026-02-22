import { Component, OnInit } from '@angular/core';
import { FluxService } from 'src/app/_services/flux.service';
import { Router } from '@angular/router';
import { StorageService } from '../_services/storage.service';
import { HttpClient } from '@angular/common/http';
import { ConnecteurService } from '../_services/connecteur.service';
import { ERPService } from '../_services/erp.service';
import { ApplicationOpenSourceService } from '../_services/application-open-source.service';
import { ERPModuleService } from '../_services/erp-module.service';
import { ApplicationOpenSourceModuleService } from '../_services/application-open-source-module.service';
declare var bootstrap: any;
@Component({
  selector: 'app-gflux',
  templateUrl: './gflux.component.html',
  styleUrls: ['./gflux.component.css']
})
export class GFluxComponent implements OnInit{
  fluxList: any[] = [];
  editingId: number | null = null;

  fluxToDelete: any = null;
  deleteModal: any;
  addModal: any; // Instance du modal d'ajout
  
  // Modal pour afficher les détails du module
  selectedModule: any = null;
  moduleModal: any;
  
  // Modal pour afficher la transformation config
  selectedFluxForConfig: any = null;
  transformationConfigModal: any;
  isEditingConfig: boolean = false;
  editedTransformationConfig: string = '';


  search = {
    nomFlux: '',
    statut: '',
    dateCreation: '',
    source: '',
    destination: ''
  };

  filteredFluxList: any[] = [];

  connecteurs: any[] = [];
  allModules: any[] = []; // Tous les modules (ERP et APP) pour la recherche
  erps: any[] = [];
  applications: any[] = [];
  sourceModules: any[] = [];
  destinationModules: any[] = [];

  newFlux: any = {
    nomFlux: '',
    typeFlux: '',
    description: '',
    sourceType: '',
    sourceApplication: null,
    sourceModule: null,
    destinationType: '',
    destinationApplication: null,
    destinationModule: null,
    transformationConfig: ''
  };
  today: Date = new Date();

  constructor(
    private http: HttpClient,
    private fluxService: FluxService,
    private storageService: StorageService,
    private router: Router,
    private connecteurService: ConnecteurService,
    private erpService: ERPService,
    private applicationOpenSourceService: ApplicationOpenSourceService,
    private erpModuleService: ERPModuleService,
    private applicationOpenSourceModuleService: ApplicationOpenSourceModuleService,
  ) {}

  ngOnInit(): void {
    this.loadFlux();
    this.connecteurService.getAll().subscribe(data => {
      this.connecteurs = data;
      console.log('Connecteurs chargés :', data);
    });
    this.erpService.getAll().subscribe(data => {
      this.erps = data;
      console.log('ERPs chargés :', data);
    });
    this.applicationOpenSourceService.getAll().subscribe(data => {
      this.applications = data;
      console.log('Applications Open Source chargées :', data);
    });

    // Charger tous les modules pour la recherche
    this.loadAllModules();

    const modalElement = document.getElementById('deleteConfirmModal');
    if (modalElement) {
      this.deleteModal = new bootstrap.Modal(modalElement);
    }

    // Initialiser le modal pour les détails du module
    const moduleModalElement = document.getElementById('moduleDetailsModal');
    if (moduleModalElement) {
      this.moduleModal = new bootstrap.Modal(moduleModalElement);
    }
    
    // Initialiser le modal pour la transformation config
    const transformationConfigModalElement = document.getElementById('transformationConfigModal');
    if (transformationConfigModalElement) {
      this.transformationConfigModal = new bootstrap.Modal(transformationConfigModalElement);
    }
  }

  loadFlux(): void {
    this.fluxService.getAllFlux().subscribe(
      data => {
        this.fluxList = data;
        this.filteredFluxList = data;
        console.log('Flux chargés : ', this.fluxList);
        // Charger les détails des modules pour chaque flux
        this.loadModuleDetails();
      },
      error => {
        console.error('Erreur lors du chargement des flux :', error);
        // Initialiser avec une liste vide en cas d'erreur
        this.fluxList = [];
        this.filteredFluxList = [];
        console.log('Liste des flux initialisée à vide');
      }
    );
  }

  startEditing(id: number) {
    this.editingId = id;
  }

  saveChanges(flux: any) {
    this.fluxService.updateFlux(flux.idFlux, flux).subscribe({
      next: () => {
        this.editingId = null;
        this.loadFlux();
      },
      error: err => console.error('Erreur de mise à jour :', err)
    });
  }

  openDeleteModal(flux: any): void {
    this.fluxToDelete = flux;
    this.deleteModal.show();
  }

  confirmDelete(): void {
    if (!this.fluxToDelete) return;

    this.fluxService.deleteFlux(this.fluxToDelete.idFlux).subscribe({
      next: () => {
        this.fluxList = this.fluxList.filter(f => f.idFlux !== this.fluxToDelete.idFlux);
        console.log('Flux supprimé avec succès');
        this.deleteModal.hide();
        this.fluxToDelete = null;
      },
      error: err => {
        console.error('Erreur lors de la suppression du flux :', err);
        this.deleteModal.hide();
        this.fluxToDelete = null;
      }
    });
  }
  cancelDelete(): void {
    this.deleteModal.hide();
    this.fluxToDelete = null;
  }

  logout(): void {
    this.storageService.clean();
    this.router.navigate(['/home']);
  }

  archiveFlux(flux: any) {
    console.log('archiveFlux appelé pour flux:', flux);
    const adminName = this.storageService.getUser()?.username || 'admin';
    console.log('adminName:', adminName);
    
    this.showNotification('Archivage en cours...', 'info');
    
    this.fluxService.archiveFlux(flux.idFlux, adminName).subscribe({
      next: (response) => {
        console.log('Archive response:', response);
        this.showNotification(
          response.message || 'Flux archivé avec succès', 
          'success'
        );
        this.loadFlux();
      },
      error: err => {
        console.error('Erreur lors de l\'archivage :', err);
        this.showNotification(
          'Erreur lors de l\'archivage: ' + (err.error?.message || err.message), 
          'error'
        );
      }
    });
  }

  validateFlux(flux: any) {
    console.log('validateFlux appelé pour flux:', flux);
    const adminName = this.storageService.getUser()?.username || 'admin';
    console.log('adminName:', adminName);
    
    // Afficher une notification de début
    this.showNotification('Validation en cours...', 'info');
    
    this.fluxService.validateFlux(flux.idFlux, adminName).subscribe({
      next: (response) => {
        console.log('Validate response:', response);
        this.showNotification(
          response.message || 'Flux validé avec succès - Exécution automatique démarrée', 
          'success'
        );
        this.loadFlux();
      },
      error: err => {
        console.error('Erreur lors de la validation :', err);
        this.showNotification(
          'Erreur lors de la validation: ' + (err.error?.message || err.message), 
          'error'
        );
      }
    });
  }

  cancelFlux(flux: any) {
    console.log('cancelFlux appelé pour flux:', flux);
    const adminName = this.storageService.getUser()?.username || 'admin';
    console.log('adminName:', adminName);
    
    this.showNotification('Annulation en cours...', 'info');
    
    this.fluxService.cancelFlux(flux.idFlux, adminName).subscribe({
      next: (response) => {
        console.log('Cancel response:', response);
        this.showNotification(
          response.message || 'Flux annulé avec succès', 
          'warning'
        );
        this.loadFlux();
      },
      error: err => {
        console.error('Erreur lors de l\'annulation :', err);
        this.showNotification(
          'Erreur lors de l\'annulation: ' + (err.error?.message || err.message), 
          'error'
        );
      }
    });
  }

  unarchiveFlux(flux: any) {
    const adminName = this.storageService.getUser()?.username || 'admin';
    this.showNotification('Désarchivage en cours...', 'info');
    
    this.fluxService.unarchiveFlux(flux.idFlux, adminName).subscribe({
      next: (response) => {
        this.showNotification(
          response.message || 'Flux désarchivé avec succès', 
          'success'
        );
        this.loadFlux();
      },
      error: err => {
        console.error('Erreur lors du désarchivage :', err);
        this.showNotification(
          'Erreur lors du désarchivage: ' + (err.error?.message || err.message), 
          'error'
        );
      }
    });
  }

  unvalidateFlux(flux: any) {
    const adminName = this.storageService.getUser()?.username || 'admin';
    this.showNotification('Dévalidation en cours...', 'info');
    
    this.fluxService.unvalidateFlux(flux.idFlux, adminName).subscribe({
      next: (response) => {
        this.showNotification(
          response.message || 'Validation révoquée avec succès', 
          'warning'
        );
        this.loadFlux();
      },
      error: err => {
        console.error('Erreur lors du dévalidation :', err);
        this.showNotification(
          'Erreur lors du dévalidation: ' + (err.error?.message || err.message), 
          'error'
        );
      }
    });
  }

  uncancelFlux(flux: any) {
    const adminName = this.storageService.getUser()?.username || 'admin';
    this.showNotification('Désannulation en cours...', 'info');
    
    this.fluxService.uncancelFlux(flux.idFlux, adminName).subscribe({
      next: (response) => {
        this.showNotification(
          response.message || 'Annulation révoquée avec succès', 
          'success'
        );
        this.loadFlux();
      },
      error: err => {
        console.error('Erreur lors du désannulation :', err);
        this.showNotification(
          'Erreur lors du désannulation: ' + (err.error?.message || err.message), 
          'error'
        );
      }
    });
  }

  onAddFlux() {
    this.newFlux = {
      nomFlux: '',
      typeFlux: '',
      description: '',
      sourceType: '',
      sourceApplication: null,
      sourceModule: null,
      destinationType: '',
      destinationApplication: null,
      destinationModule: null,
      transformationConfig: ''
    };
    this.sourceModules = [];
    this.destinationModules = [];
    
    // Créer et stocker l'instance du modal
    this.addModal = new (window as any).bootstrap.Modal(document.getElementById('addFluxModal'));
    this.addModal.show();
  }

  closeAddModal() {
    try {
      // Méthode 1: Utiliser l'instance stockée
      if (this.addModal) {
        this.addModal.hide();
        console.log('Modal fermé avec l\'instance stockée');
        return;
      }
      
      // Méthode 2: Essayer de récupérer l'instance existante
      const modalElement = document.getElementById('addFluxModal');
      if (modalElement) {
        const modalInstance = (window as any).bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.hide();
          console.log('Modal fermé avec getInstance()');
          return;
        }
      }
      
      // Méthode 3: Fermeture manuelle
      this.forceCloseModal();
      
    } catch (error) {
      console.error('Erreur lors de la fermeture du modal:', error);
      this.forceCloseModal();
    }
  }

  private forceCloseModal() {
    // Nettoyer le backdrop
    const modalBackdrop = document.querySelector('.modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.remove();
    }
    
    // Restaurer le scroll du body
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    
    // Masquer le modal
    const modalElement = document.getElementById('addFluxModal');
    if (modalElement) {
      modalElement.style.display = 'none';
      modalElement.classList.remove('show');
    }
    
    console.log('Modal fermé manuellement');
  }

  submitAddFlux() {
    // Validation des champs obligatoires
    if (!this.newFlux.nomFlux || !this.newFlux.typeFlux) {
      alert('Le nom du flux et le type sont obligatoires');
      return;
    }

    const fluxToAdd = {
      nomFlux: this.newFlux.nomFlux,
      typeFlux: this.newFlux.typeFlux,
      description: this.newFlux.description || '',
      dateCreation: this.today,
      statut: 'EN_ATTENTE',
      transformationConfig: this.newFlux.transformationConfig || null,
      // Source
      sourceErpModule: this.newFlux.sourceType === 'ERP' ? this.newFlux.sourceModule : null,
      sourceAppModule: this.newFlux.sourceType === 'APP' ? this.newFlux.sourceModule : null,
      // Destination
      destinationErpModule: this.newFlux.destinationType === 'ERP' ? this.newFlux.destinationModule : null,
      destinationAppModule: this.newFlux.destinationType === 'APP' ? this.newFlux.destinationModule : null
    };

    console.log('Données à envoyer:', fluxToAdd);

    this.fluxService.createFlux(fluxToAdd).subscribe({
      next: (response) => {
        console.log('Flux créé avec succès:', response);
        this.loadFlux();
        this.closeAddModal();
        alert('Flux ajouté avec succès !');
      },
      error: (error) => {
        console.error('Erreur détaillée lors de l\'ajout:', error);
        console.error('Status:', error.status);
        console.error('Message:', error.message);
        console.error('Error body:', error.error);
        
        let errorMessage = 'Erreur lors de l\'ajout du flux';
        if (error.error && error.error.message) {
          errorMessage += ': ' + error.error.message;
        } else if (error.message) {
          errorMessage += ': ' + error.message;
        } else if (error.status === 400) {
          errorMessage += ': Données invalides (vérifiez les champs obligatoires)';
        } else if (error.status === 404) {
          errorMessage += ': Endpoint non trouvé';
        } else if (error.status === 500) {
          errorMessage += ': Erreur serveur';
        }
        
        alert(errorMessage);
      }
    });
  }

  onSearch() {
    // Recherche AJAX via le backend
    this.fluxService.searchFlux(
      this.search.nomFlux || undefined,
      this.search.statut || undefined,
      this.search.dateCreation || undefined,
      this.search.source || undefined,
      this.search.destination || undefined
    ).subscribe({
      next: (data) => {
        this.filteredFluxList = data;
        this.loadModuleDetails(); // Recharger les détails des modules
        console.log(`Résultats de recherche AJAX: ${data.length} flux trouvés`);
      },
      error: (err) => {
        console.error('Erreur lors de la recherche AJAX:', err);
        this.showNotification('Erreur lors de la recherche', 'error');
      }
    });
  }

  atLeastOneFilled(): boolean {
    return Object.values(this.search).some(val => val && val.trim() !== '');
  }

  // Méthode pour charger les détails des modules
  loadModuleDetails(): void {
    this.fluxList.forEach(flux => {
      // Charger les détails du module source ERP
      if (flux.sourceErpModule && flux.sourceErpModule.id) {
        this.erpModuleService.getById(flux.sourceErpModule.id).subscribe(
          moduleDetails => {
            flux.sourceErpModule = { ...flux.sourceErpModule, ...moduleDetails };
          }
        );
      }
      
      // Charger les détails du module source APP
      if (flux.sourceAppModule && flux.sourceAppModule.id) {
        this.applicationOpenSourceModuleService.getById(flux.sourceAppModule.id).subscribe(
          moduleDetails => {
            flux.sourceAppModule = { ...flux.sourceAppModule, ...moduleDetails };
          }
        );
      }
      
      // Charger les détails du module destination ERP
      if (flux.destinationErpModule && flux.destinationErpModule.id) {
        this.erpModuleService.getById(flux.destinationErpModule.id).subscribe(
          moduleDetails => {
            flux.destinationErpModule = { ...flux.destinationErpModule, ...moduleDetails };
          }
        );
      }
      
      // Charger les détails du module destination APP
      if (flux.destinationAppModule && flux.destinationAppModule.id) {
        this.applicationOpenSourceModuleService.getById(flux.destinationAppModule.id).subscribe(
          moduleDetails => {
            flux.destinationAppModule = { ...flux.destinationAppModule, ...moduleDetails };
          }
        );
      }
    });
  }

  // Méthodes pour gérer les changements de source
  onSourceTypeChange(): void {
    this.newFlux.sourceApplication = null;
    this.newFlux.sourceModule = null;
    this.sourceModules = [];
  }

  onSourceApplicationChange(): void {
    this.newFlux.sourceModule = null;
    this.sourceModules = [];
    
    console.log('Source Application changée:', this.newFlux.sourceApplication);
    console.log('Source Type:', this.newFlux.sourceType);
    
    if (this.newFlux.sourceApplication && this.newFlux.sourceType) {
      if (this.newFlux.sourceType === 'ERP') {
        console.log('Chargement des modules ERP pour ID:', this.newFlux.sourceApplication.id);
        this.erpModuleService.getByERP(this.newFlux.sourceApplication.id).subscribe(
          (modules: any[]) => {
            this.sourceModules = modules;
            console.log('Modules ERP source chargés :', modules);
            // Si aucun module trouvé par ERP, charger tous les modules ERP
            if (modules.length === 0) {
              console.log('Aucun module trouvé pour cet ERP, chargement de tous les modules ERP');
              this.erpModuleService.getAll().subscribe(allModules => {
                this.sourceModules = allModules;
                console.log('Tous les modules ERP chargés :', allModules);
              });
            }
          },
          (error) => {
            console.error('Erreur lors du chargement des modules ERP:', error);
            // Fallback : charger tous les modules ERP
            this.erpModuleService.getAll().subscribe(allModules => {
              this.sourceModules = allModules;
              console.log('Fallback: Tous les modules ERP chargés :', allModules);
            });
          }
        );
      } else if (this.newFlux.sourceType === 'APP') {
        console.log('Chargement des modules APP pour ID:', this.newFlux.sourceApplication.id);
        this.applicationOpenSourceModuleService.getByApplication(this.newFlux.sourceApplication.id).subscribe(
          (modules: any[]) => {
            this.sourceModules = modules;
            console.log('Modules APP source chargés :', modules);
          },
          (error) => {
            console.error('Erreur lors du chargement des modules APP:', error);
          }
        );
      }
    }
  }

  // Méthodes pour gérer les changements de destination
  onDestinationTypeChange(): void {
    this.newFlux.destinationApplication = null;
    this.newFlux.destinationModule = null;
    this.destinationModules = [];
  }

  onDestinationApplicationChange(): void {
    this.newFlux.destinationModule = null;
    this.destinationModules = [];
    
    console.log('Destination Application changée:', this.newFlux.destinationApplication);
    console.log('Destination Type:', this.newFlux.destinationType);
    
    if (this.newFlux.destinationApplication && this.newFlux.destinationType) {
      if (this.newFlux.destinationType === 'ERP') {
        console.log('Chargement des modules ERP destination pour ID:', this.newFlux.destinationApplication.id);
        this.erpModuleService.getByERP(this.newFlux.destinationApplication.id).subscribe(
          (modules: any[]) => {
            this.destinationModules = modules;
            console.log('Modules ERP destination chargés :', modules);
            // Si aucun module trouvé par ERP, charger tous les modules ERP
            if (modules.length === 0) {
              console.log('Aucun module trouvé pour cet ERP destination, chargement de tous les modules ERP');
              this.erpModuleService.getAll().subscribe(allModules => {
                this.destinationModules = allModules;
                console.log('Tous les modules ERP destination chargés :', allModules);
              });
            }
          },
          (error) => {
            console.error('Erreur lors du chargement des modules ERP destination:', error);
            // Fallback : charger tous les modules ERP
            this.erpModuleService.getAll().subscribe(allModules => {
              this.destinationModules = allModules;
              console.log('Fallback: Tous les modules ERP destination chargés :', allModules);
            });
          }
        );
      } else if (this.newFlux.destinationType === 'APP') {
        console.log('Chargement des modules APP destination pour ID:', this.newFlux.destinationApplication.id);
        this.applicationOpenSourceModuleService.getByApplication(this.newFlux.destinationApplication.id).subscribe(
          (modules: any[]) => {
            this.destinationModules = modules;
            console.log('Modules APP destination chargés :', modules);
          },
          (error) => {
            console.error('Erreur lors du chargement des modules APP destination:', error);
          }
        );
      }
    }
  }

  resetFilters(): void {
    this.search = {
      nomFlux: '',
      statut: '',
      dateCreation: '',
      source: '',
      destination: ''
    };
    this.filteredFluxList = this.fluxList;
  }

  // Méthode pour charger tous les modules (ERP et APP) pour la recherche
  loadAllModules(): void {
    this.allModules = [];
    
    // Charger les modules ERP
    this.erpModuleService.getAll().subscribe(erpModules => {
      this.allModules = [...this.allModules, ...erpModules];
    });
    
    // Charger les modules d'applications open source
    this.applicationOpenSourceModuleService.getAll().subscribe(appModules => {
      this.allModules = [...this.allModules, ...appModules];
    });
  }

  // Méthode pour obtenir la classe CSS selon le type de module
  getModuleTypeClass(module: any): string {
    if (module.typeModule) {
      switch (module.typeModule.toUpperCase()) {
        case 'USER':
          return 'text-primary';
        case 'DATA':
          return 'text-info';
        case 'COMPETITION':
          return 'text-warning';
        case 'PRODUCT':
          return 'text-success';
        case 'TRAINING':
          return 'text-danger';
        case 'EVENT':
          return 'text-purple';
        case 'TEAM':
          return 'text-secondary';
        case 'TICKET':
          return 'text-dark';
        case 'CONTENT':
          return 'text-info';
        default:
          return 'text-muted';
      }
    }
    return 'text-muted';
  }

  // Méthode pour obtenir le label du type de module
  getModuleTypeLabel(module: any): string {
    if (module.typeModule) {
      switch (module.typeModule.toUpperCase()) {
        case 'USER':
          return 'Gestion des utilisateurs';
        case 'DATA':
          return 'Gestion des données';
        case 'COMPETITION':
          return 'Gestion des compétitions';
        case 'PRODUCT':
          return 'Gestion des produits';
        case 'TRAINING':
          return 'Gestion des formations';
        case 'EVENT':
          return 'Gestion des événements';
        case 'TEAM':
          return 'Gestion des équipes';
        case 'TICKET':
          return 'Gestion des billets';
        case 'CONTENT':
          return 'Gestion du contenu';
        default:
          return module.typeModule;
      }
    }
    return 'Module';
  }

  // Méthode pour afficher les détails d'un module
  showModuleDetails(module: any): void {
    if (module) {
      this.selectedModule = module;
      if (this.moduleModal) {
        this.moduleModal.show();
      }
    }
  }

  // Méthode pour fermer le modal des détails du module
  closeModuleModal(): void {
    if (this.moduleModal) {
      this.moduleModal.hide();
    }
    this.selectedModule = null;
  }

  // Méthode pour formater le JSON de configuration
  formatJson(jsonString: string): string {
    if (!jsonString) return 'Aucune configuration';
    try {
      const parsed = JSON.parse(jsonString);
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      return jsonString;
    }
  }

  // Méthode pour obtenir le type de module avec icône
  getModuleTypeWithIcon(module: any): string {
    if (module.typeModule) {
      switch (module.typeModule.toUpperCase()) {
        case 'USER':
          return '👤 Gestion des utilisateurs';
        case 'DATA':
          return '📊 Gestion des données';
        case 'COMPETITION':
          return '🏆 Gestion des compétitions';
        case 'PRODUCT':
          return '📦 Gestion des produits';
        case 'TRAINING':
          return '🎓 Gestion des formations';
        case 'EVENT':
          return '🎪 Gestion des événements';
        case 'TEAM':
          return '👥 Gestion des équipes';
        case 'TICKET':
          return '🎫 Gestion des billets';
        case 'CONTENT':
          return '📝 Gestion du contenu';
        default:
          return `⚙️ ${module.typeModule}`;
      }
    }
    return '⚙️ Module';
  }


  closeAddFluxModal() {
    const modalEl = document.getElementById('addFluxModal');
    if (modalEl) {
      modalEl.classList.remove('show');
      modalEl.setAttribute('aria-hidden', 'true');
      modalEl.removeAttribute('aria-modal');
      modalEl.style.display = 'none';
      // Supprime le backdrop si besoin
      const backdrops = document.getElementsByClassName('modal-backdrop');
      while (backdrops.length > 0) {
        backdrops[0].parentNode?.removeChild(backdrops[0]);
      }
      document.body.classList.remove('modal-open');
    }
  }

  // ==================== NOUVELLES FONCTIONNALITÉS ====================

  /**
   * Système de notifications
   */
  showNotification(message: string, type: 'success' | 'error' | 'warning' | 'info') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    
    notification.innerHTML = `
      <i class="bi bi-${this.getNotificationIcon(type)} me-2"></i>
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-supprimer après 5 secondes
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 5000);
  }

  private getNotificationIcon(type: string): string {
    switch (type) {
      case 'success': return 'check-circle-fill';
      case 'error': return 'exclamation-triangle-fill';
      case 'warning': return 'exclamation-circle-fill';
      case 'info': return 'info-circle-fill';
      default: return 'info-circle-fill';
    }
  }

  /**
   * Exécution manuelle d'un flux
   */
  executeFlux(flux: any) {
    const adminName = this.storageService.getUser()?.username || 'admin';
    this.showNotification('Exécution en cours...', 'info');
    
    this.fluxService.executeFlux(flux.idFlux).subscribe({
      next: (response) => {
        this.showNotification(
          `Flux exécuté: ${response.successCount} succès, ${response.errorCount} erreurs`, 
          response.success ? 'success' : 'warning'
        );
        this.loadFlux();
      },
      error: err => {
        console.error('Erreur lors de l\'exécution :', err);
        this.showNotification(
          'Erreur lors de l\'exécution: ' + (err.error?.message || err.message), 
          'error'
        );
      }
    });
  }

  /**
   * Test de connexion d'un flux
   */
  testFluxConnection(flux: any) {
    this.showNotification('Test de connexion en cours...', 'info');
    
    this.fluxService.testFluxConnection(flux.idFlux).subscribe({
      next: (response) => {
        if (response.overallStatus === 'OK') {
          this.showNotification('Connexions testées avec succès', 'success');
        } else {
          this.showNotification(
            'Problèmes de connexion détectés: ' + (response.sourceError || response.destinationError), 
            'warning'
          );
        }
      },
      error: err => {
        console.error('Erreur lors du test :', err);
        this.showNotification(
          'Erreur lors du test: ' + (err.error?.message || err.message), 
          'error'
        );
      }
    });
  }

  /**
   * Obtenir les actions disponibles pour un flux
   */
  getAvailableActions(flux: any): string[] {
    const actions: string[] = [];
    
    switch (flux.statut) {
      case 'EN_ATTENTE':
        actions.push('validate', 'archive', 'cancel');
        break;
      case 'VALIDÉ':
      case 'EN_COURS':
        actions.push('archive', 'cancel');
        break;
      case 'TERMINE':
        actions.push('archive', 'execute');
        break;
      case 'ECHEC':
        actions.push('archive', 'execute', 'cancel');
        break;
      case 'ARCHIVE':
        actions.push('unarchive');
        break;
    }
    
    // Actions admin supplémentaires
    if (flux.archived) {
      actions.push('unarchive');
    }
    if (flux.validated) {
      actions.push('unvalidate');
    }
    if (flux.cancelled) {
      actions.push('uncancel');
    }
    
    return actions;
  }

  /**
   * Actions en lot
   */
  selectedFluxes: number[] = [];
  
  toggleFluxSelection(fluxId: number) {
    const index = this.selectedFluxes.indexOf(fluxId);
    if (index > -1) {
      this.selectedFluxes.splice(index, 1);
    } else {
      this.selectedFluxes.push(fluxId);
    }
  }

  executeBatchAction(action: string) {
    if (this.selectedFluxes.length === 0) {
      this.showNotification('Veuillez sélectionner au moins un flux', 'warning');
      return;
    }
    
    const adminName = this.storageService.getUser()?.username || 'admin';
    this.showNotification(`Action "${action}" en cours sur ${this.selectedFluxes.length} flux(s)...`, 'info');
    
    this.fluxService.executeBatchAction(action, this.selectedFluxes, adminName).subscribe({
      next: (response) => {
        this.showNotification(
          `Action terminée: ${response.successCount} succès, ${response.errorCount} erreurs`, 
          response.errorCount === 0 ? 'success' : 'warning'
        );
        this.selectedFluxes = [];
        this.loadFlux();
      },
      error: err => {
        console.error('Erreur lors de l\'action en lot :', err);
        this.showNotification(
          'Erreur lors de l\'action en lot: ' + (err.error?.message || err.message), 
          'error'
        );
      }
    });
  }

  /**
   * Obtenir les statistiques des flux
   */
  fluxStats: any = null;
  
  loadFluxStatistics() {
    this.fluxService.getFluxStatistics().subscribe({
      next: (stats) => {
        this.fluxStats = stats;
        console.log('Statistiques des flux:', stats);
        // Afficher le modal des statistiques
        const modal = new (window as any).bootstrap.Modal(document.getElementById('statisticsModal'));
        modal.show();
      },
      error: err => console.error('Erreur lors du chargement des statistiques:', err)
    });
  }

  /**
   * Vérifier la santé du système
   */
  systemHealth: any = null;
  
  checkSystemHealth() {
    this.fluxService.getSystemHealth().subscribe({
      next: (health) => {
        this.systemHealth = health;
        console.log('État du système:', health);
        
        // Afficher le modal d'état
        const modal = new (window as any).bootstrap.Modal(document.getElementById('healthModal'));
        modal.show();
        
        if (!health.healthy) {
          this.showNotification(
            `Problèmes détectés: ${health.issues?.join(', ') || 'État inconnu'}`, 
            'warning'
          );
        } else {
          this.showNotification('Système en bon état', 'success');
        }
      },
      error: err => console.error('Erreur lors de la vérification:', err)
    });
  }

  /**
   * Ajouter une configuration de transformation par défaut
   */
  addDefaultTransformationConfig() {
    const defaultConfig = {
      mapping: {
        "source_field_1": "destination_field_1",
        "source_field_2": "destination_field_2"
      },
      transformation_rules: [
        {
          field: "destination_field_1",
          operation: "string_operations",
          params: { operation: "uppercase" }
        }
      ]
    };
    
    this.newFlux.transformationConfig = JSON.stringify(defaultConfig, null, 2);
    this.showNotification('Template de transformation ajouté', 'success');
  }

  /**
   * Afficher la configuration de transformation d'un flux
   */
  showTransformationConfig(flux: any): void {
    if (flux) {
      this.selectedFluxForConfig = flux;
      this.isEditingConfig = false;
      this.editedTransformationConfig = flux.transformationConfig || '';
      
      console.log('Flux sélectionné:', flux);
      console.log('Transformation Config:', flux.transformationConfig);
      console.log('Modal instance:', this.transformationConfigModal);
      
      if (this.transformationConfigModal) {
        this.transformationConfigModal.show();
      } else {
        console.error('Modal transformation config non initialisé!');
      }
    }
  }

  /**
   * Fermer le modal de transformation config
   */
  closeTransformationConfigModal(): void {
    if (this.transformationConfigModal) {
      this.transformationConfigModal.hide();
    }
    this.selectedFluxForConfig = null;
    this.isEditingConfig = false;
    this.editedTransformationConfig = '';
  }

  /**
   * Basculer entre mode lecture et édition
   */
  toggleEditConfig(): void {
    this.isEditingConfig = !this.isEditingConfig;
    if (this.isEditingConfig) {
      this.editedTransformationConfig = this.selectedFluxForConfig.transformationConfig || '';
    }
  }

  /**
   * Annuler l'édition de la config
   */
  cancelEditConfig(): void {
    this.isEditingConfig = false;
    this.editedTransformationConfig = this.selectedFluxForConfig.transformationConfig || '';
  }

  /**
   * Sauvegarder la configuration de transformation modifiée
   */
  saveTransformationConfig(): void {
    // Valider le JSON
    try {
      if (this.editedTransformationConfig.trim()) {
        JSON.parse(this.editedTransformationConfig);
      }
    } catch (e) {
      this.showNotification('JSON invalide ! Veuillez corriger le format.', 'error');
      return;
    }

    // Préparer les données pour la mise à jour
    const updatedFlux = {
      ...this.selectedFluxForConfig,
      transformationConfig: this.editedTransformationConfig || null
    };

    // Mettre à jour le flux
    this.fluxService.updateFlux(this.selectedFluxForConfig.idFlux, updatedFlux).subscribe({
      next: (response) => {
        this.showNotification('Configuration de transformation mise à jour avec succès', 'success');
        this.selectedFluxForConfig.transformationConfig = this.editedTransformationConfig;
        this.isEditingConfig = false;
        this.loadFlux(); // Recharger la liste
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour:', err);
        this.showNotification(
          'Erreur lors de la mise à jour: ' + (err.error?.message || err.message),
          'error'
        );
      }
    });
  }

}