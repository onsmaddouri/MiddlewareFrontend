import { Component, OnInit } from '@angular/core';
import { FluxService } from 'src/app/_services/flux.service';
import { Router } from '@angular/router';
import { StorageService } from '../_services/storage.service';
import { HttpClient } from '@angular/common/http';
import { ConnecteurService } from '../_services/connecteur.service';
import { GenerateurFluxService } from '../_services/generateur-flux.service';
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
  
  // Modal pour afficher les détails du module
  selectedModule: any = null;
  moduleModal: any;


  search = {
    nomFlux: '',
    statut: '',
    dateCreation: '',
    source: '',
    destination: ''
  };

  filteredFluxList: any[] = [];

  connecteurs: any[] = [];
  generateurs: any[] = [];
  allModules: any[] = []; // Tous les modules (ERP et APP) pour la recherche
  erps: any[] = [];
  applications: any[] = [];
  sourceModules: any[] = [];
  destinationModules: any[] = [];

  newFlux: any = {
    nomFlux: '',
    typeFlux: '',
    sourceType: '',
    sourceApplication: null,
    sourceModule: null,
    destinationType: '',
    destinationApplication: null,
    destinationModule: null,
    generateurFlux: null
  };
  today: Date = new Date();

  constructor(
    private http: HttpClient,
    private fluxService: FluxService,
    private storageService: StorageService,
    private router: Router,
    private connecteurService: ConnecteurService,
    private generateurFluxService: GenerateurFluxService,
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
    this.generateurFluxService.getAll().subscribe(data => {
      this.generateurs = data;
      console.log('Générateurs chargés :', data);
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
    this.fluxService.archiveFlux(flux.idFlux, adminName).subscribe({
      next: (response) => {
        console.log('Archive response:', response);
        this.loadFlux();
      },
      error: err => console.error('Erreur lors de l\'archivage :', err)
    });
  }

  validateFlux(flux: any) {
    console.log('validateFlux appelé pour flux:', flux);
    const adminName = this.storageService.getUser()?.username || 'admin';
    console.log('adminName:', adminName);
    this.fluxService.validateFlux(flux.idFlux, adminName).subscribe({
      next: (response) => {
        console.log('Validate response:', response);
        this.loadFlux();
      },
      error: err => console.error('Erreur lors de la validation :', err)
    });
  }

  cancelFlux(flux: any) {
    console.log('cancelFlux appelé pour flux:', flux);
    const adminName = this.storageService.getUser()?.username || 'admin';
    console.log('adminName:', adminName);
    this.fluxService.cancelFlux(flux.idFlux, adminName).subscribe({
      next: (response) => {
        console.log('Cancel response:', response);
        this.loadFlux();
      },
      error: err => console.error('Erreur lors de l\'annulation :', err)
    });
  }

  unarchiveFlux(flux: any) {
    const adminName = this.storageService.getUser()?.username || 'admin';
    this.fluxService.unarchiveFlux(flux.idFlux, adminName).subscribe({
      next: () => this.loadFlux(),
      error: err => console.error('Erreur lors du désarchivage :', err)
    });
  }

  unvalidateFlux(flux: any) {
    const adminName = this.storageService.getUser()?.username || 'admin';
    this.fluxService.unvalidateFlux(flux.idFlux, adminName).subscribe({
      next: () => this.loadFlux(),
      error: err => console.error('Erreur lors du dévalidation :', err)
    });
  }

  uncancelFlux(flux: any) {
    const adminName = this.storageService.getUser()?.username || 'admin';
    this.fluxService.uncancelFlux(flux.idFlux, adminName).subscribe({
      next: () => this.loadFlux(),
      error: err => console.error('Erreur lors du désannulation :', err)
    });
  }

  onAddFlux() {
    this.newFlux = {
      nomFlux: '',
      typeFlux: '',
      sourceType: '',
      sourceApplication: null,
      sourceModule: null,
      destinationType: '',
      destinationApplication: null,
      destinationModule: null,
      generateurFlux: null
    };
    this.sourceModules = [];
    this.destinationModules = [];
    const modal = new (window as any).bootstrap.Modal(document.getElementById('addFluxModal'));
    modal.show();
  }

  submitAddFlux() {
    const fluxToAdd = {
      nomFlux: this.newFlux.nomFlux,
      typeFlux: this.newFlux.typeFlux,
      dateCreation: this.today,
      statut: 'EN_ATTENTE',
      generateurFlux: this.newFlux.generateurFlux,
      // Source
      sourceErpModule: this.newFlux.sourceType === 'ERP' ? this.newFlux.sourceModule : null,
      sourceAppModule: this.newFlux.sourceType === 'APP' ? this.newFlux.sourceModule : null,
      // Destination
      destinationErpModule: this.newFlux.destinationType === 'ERP' ? this.newFlux.destinationModule : null,
      destinationAppModule: this.newFlux.destinationType === 'APP' ? this.newFlux.destinationModule : null
    };
    this.fluxService.createFlux(fluxToAdd).subscribe({
      next: () => {
        this.loadFlux();
        (window as any).bootstrap.Modal.getInstance(document.getElementById('addFluxModal')).hide();
      },
      error: err => alert('Erreur lors de l\'ajout du flux')
    });
  }

  onSearch() {
    this.filteredFluxList = this.fluxList.filter(flux => {
      const matchNom = !this.search.nomFlux || (flux.nomFlux && flux.nomFlux.toLowerCase().includes(this.search.nomFlux.toLowerCase()));
      const matchStatut = !this.search.statut || flux.statut === this.search.statut;
      const matchDate = !this.search.dateCreation || (flux.dateCreation && flux.dateCreation.startsWith(this.search.dateCreation));
      
      // Recherche par source (module source ERP ou APP)
      const matchSource = !this.search.source || 
        (flux.sourceErpModule && flux.sourceErpModule.nom && flux.sourceErpModule.nom.toLowerCase().includes(this.search.source.toLowerCase())) ||
        (flux.sourceAppModule && flux.sourceAppModule.nom && flux.sourceAppModule.nom.toLowerCase().includes(this.search.source.toLowerCase()));
      
      // Recherche par destination (module destination ERP ou APP)
      const matchDestination = !this.search.destination || 
        (flux.destinationErpModule && flux.destinationErpModule.nom && flux.destinationErpModule.nom.toLowerCase().includes(this.search.destination.toLowerCase())) ||
        (flux.destinationAppModule && flux.destinationAppModule.nom && flux.destinationAppModule.nom.toLowerCase().includes(this.search.destination.toLowerCase()));
      
      return matchNom && matchStatut && matchDate && matchSource && matchDestination;
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
          },
          (error) => {
            console.error('Erreur lors du chargement des modules ERP:', error);
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
          },
          (error) => {
            console.error('Erreur lors du chargement des modules ERP destination:', error);
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

}
