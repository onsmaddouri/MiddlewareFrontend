import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { EventBusService } from '../_shared/event-bus.service';
import { FluxService } from '../_services/flux.service';
import { ReportService } from '../_services/report.service';
import { ConnecteurService } from '../_services/connecteur.service';
import { ERPService } from '../_services/erp.service';
import { GenerateurFluxService } from '../_services/generateur-flux.service';
import { ApplicationOpenSourceService } from '../_services/application-open-source.service';
import { ApplicationOpenSourceModuleService } from '../_services/application-open-source-module.service';
import { ERPModuleService } from '../_services/erp-module.service';
import { LogService } from '../_services/log.service';

@Component({
  selector: 'app-board-user',
  templateUrl: './board-user.component.html',
  styleUrls: ['./board-user.component.css']
})
export class BoardUserComponent implements OnInit {
  content?: string;
  loading: boolean = false;
  
  // Statistiques des flux
  totalFluxCount: number = 0;
  
  // Statistiques des rapports
  reportsCount: number = 0;
  
  // Statistiques des ERP
  totalERPsCount: number = 0;

  // Statistiques des Applications Open Source
  totalApplicationsCount: number = 0;

  // Statistiques des Modules
  totalAppModulesCount: number = 0;
  totalERPModulesCount: number = 0;

  // Statistiques des Logs
  logsCount: number = 0;

  // Propriétés pour la carte d'information
  showInfoCard: boolean = false;
  selectedCategory: string = '';
  infoCardTitle: string = '';
  infoCardData: any[] = [];
  loadingDetails: boolean = false;

  // Propriétés pour le modal de détails
  showDetailsModal: boolean = false;
  selectedItemName: string = '';
  selectedItemDetails: {label: string, value: string}[] = [];

  constructor(
    private userService: UserService,
    private eventBusService: EventBusService,
    private fluxService: FluxService,
    private reportService: ReportService,
    private erpService: ERPService,
    private applicationOpenSourceService: ApplicationOpenSourceService,
    private applicationOpenSourceModuleService: ApplicationOpenSourceModuleService,
    private erpModuleService: ERPModuleService,
    private logService: LogService
  ) {}

  ngOnInit(): void {
    this.userService.getUserBoard().subscribe({
      next: data => {
        this.content = data;
      },
      error: err => {
        if (err.error) {
          try {
            const res = JSON.parse(err.error);
            this.content = res.message;
          } catch {
            this.content = `Error with status: ${err.status} - ${err.statusText}`;
          }
        } else {
          this.content = `Error with status: ${err.status}`;
        }
      }
    });

    // Charger les statistiques utilisateur
    this.loadUserStatistics();
    this.initializeModals();
  }

  loadUserStatistics(): void {
    this.loading = true;
    
    // Charger les statistiques des flux
    this.loadFluxStatistics();
    
    // Charger les statistiques des rapports
    this.loadReportsStatistics();
    
    // Charger les statistiques des ERP
    this.loadERPsStatistics();
    
    // Charger les statistiques des Applications Open Source
    this.loadApplicationsStatistics();
    
    // Charger les statistiques des Modules
    this.loadModulesStatistics();
    
    // Charger les statistiques des Logs
    this.loadLogsStatistics();
  }

  loadFluxStatistics(): void {
    this.fluxService.getAllFlux().subscribe({
      next: (fluxes: any[]) => {
        this.totalFluxCount = fluxes.length;
        this.checkLoadingComplete();
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des statistiques de flux:', err);
        this.checkLoadingComplete();
      }
    });
  }

  loadReportsStatistics(): void {
    this.reportService.getAll().subscribe({
      next: (reports: any[]) => {
        this.reportsCount = reports.length;
        this.checkLoadingComplete();
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des statistiques de rapports:', err);
        this.checkLoadingComplete();
      }
    });
  }


  loadERPsStatistics(): void {
    this.erpService.getAll().subscribe({
      next: (erps: any[]) => {
        this.totalERPsCount = erps.length;
        this.checkLoadingComplete();
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des statistiques d\'ERP:', err);
        this.checkLoadingComplete();
      }
    });
  }

  private checkLoadingComplete(): void {
    // Cette méthode peut être utilisée pour vérifier si toutes les statistiques sont chargées
    // Pour l'instant, on laisse chaque service gérer son propre loading
    this.loading = false;
  }

  loadApplicationsStatistics(): void {
    this.applicationOpenSourceService.getAll().subscribe({
      next: (applications: any[]) => {
        this.totalApplicationsCount = applications.length;
        this.checkLoadingComplete();
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des statistiques d\'applications:', err);
        this.checkLoadingComplete();
      }
    });
  }

  loadModulesStatistics(): void {
    // Statistiques des modules d'applications
    this.applicationOpenSourceModuleService.getAll().subscribe({
      next: (modules: any[]) => {
        this.totalAppModulesCount = modules.length;
        this.checkLoadingComplete();
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des statistiques de modules d\'applications:', err);
        this.checkLoadingComplete();
      }
    });

    // Statistiques des modules ERP
    this.erpModuleService.getAll().subscribe({
      next: (modules: any[]) => {
        this.totalERPModulesCount = modules.length;
        this.checkLoadingComplete();
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des statistiques de modules ERP:', err);
        this.checkLoadingComplete();
      }
    });
  }

  loadLogsStatistics(): void {
    this.logService.getAll().subscribe({
      next: (logs: any[]) => {
        this.logsCount = logs.length;
        this.checkLoadingComplete();
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des statistiques de logs:', err);
        this.checkLoadingComplete();
      }
    });
  }

  // Méthodes pour la carte d'information
  initializeModals(): void {
    // Initialisation des modals Bootstrap si nécessaire
    // Les modals sont gérés via Angular avec des variables boolean
  }

  onStatCardClick(category: string): void {
    this.selectedCategory = category;
    this.loadingDetails = true;
    this.showInfoCard = true;

    switch (category) {
      case 'flux':
        this.infoCardTitle = 'Liste des Flux de Données';
        this.loadFluxDetails();
        break;
      case 'rapports':
        this.infoCardTitle = 'Liste des Rapports';
        this.loadReportsDetails();
        break;
      case 'erp':
        this.infoCardTitle = 'Liste des Systèmes ERP';
        this.loadERPDetails();
        break;
      case 'applications':
        this.infoCardTitle = 'Liste des Applications Open Source';
        this.loadApplicationsDetails();
        break;
      case 'app-modules':
        this.infoCardTitle = 'Liste des Modules d\'Applications';
        this.loadAppModulesDetails();
        break;
      case 'erp-modules':
        this.infoCardTitle = 'Liste des Modules ERP';
        this.loadERPModulesDetails();
        break;
      case 'logs':
        this.infoCardTitle = 'Liste des Logs';
        this.loadLogsDetails();
        break;
    }
  }

  loadFluxDetails(): void {
    this.fluxService.getAllFlux().subscribe({
      next: (flux: any[]) => {
        this.infoCardData = flux;
        this.loadingDetails = false;
      },
      error: (err: any) => {
        console.error('Error loading flux details:', err);
        this.loadingDetails = false;
      }
    });
  }

  loadReportsDetails(): void {
    this.reportService.getAll().subscribe({
      next: (reports) => {
        this.infoCardData = reports;
        this.loadingDetails = false;
      },
      error: (err) => {
        console.error('Error loading reports details:', err);
        this.loadingDetails = false;
      }
    });
  }

  loadLogsDetails(): void {
    this.logService.getAll().subscribe({
      next: (logs) => {
        this.infoCardData = logs;
        this.loadingDetails = false;
      },
      error: (err) => {
        console.error('Error loading logs details:', err);
        this.loadingDetails = false;
      }
    });
  }

  loadERPDetails(): void {
    this.erpService.getAll().subscribe({
      next: (erps) => {
        this.infoCardData = erps;
        this.loadingDetails = false;
      },
      error: (err) => {
        console.error('Error loading ERP details:', err);
        this.loadingDetails = false;
      }
    });
  }

  loadApplicationsDetails(): void {
    this.applicationOpenSourceService.getAll().subscribe({
      next: (applications) => {
        this.infoCardData = applications;
        this.loadingDetails = false;
      },
      error: (err) => {
        console.error('Error loading applications details:', err);
        this.loadingDetails = false;
      }
    });
  }

  loadAppModulesDetails(): void {
    this.applicationOpenSourceModuleService.getAll().subscribe({
      next: (modules) => {
        this.infoCardData = modules;
        this.loadingDetails = false;
      },
      error: (err) => {
        console.error('Error loading app modules details:', err);
        this.loadingDetails = false;
      }
    });
  }

  loadERPModulesDetails(): void {
    this.erpModuleService.getAll().subscribe({
      next: (modules) => {
        this.infoCardData = modules;
        this.loadingDetails = false;
      },
      error: (err) => {
        console.error('Error loading ERP modules details:', err);
        this.loadingDetails = false;
      }
    });
  }

  closeInfoCard(): void {
    this.showInfoCard = false;
    this.selectedCategory = '';
    this.infoCardTitle = '';
    this.infoCardData = [];
  }

  showItemDetails(item: any): void {
    console.log('Détails de l\'élément:', item);
    
    this.selectedItemName = this.getItemName(item);
    this.selectedItemDetails = this.getFormattedDetails(item);
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedItemName = '';
    this.selectedItemDetails = [];
  }

  getFormattedDetails(item: any): {label: string, value: string}[] {
    const details: {label: string, value: string}[] = [];
    
    if (this.selectedCategory === 'flux') {
      this.addFluxDetails(details, item);
    } else if (this.selectedCategory === 'rapports') {
      this.addReportDetails(details, item);
    } else if (this.selectedCategory === 'erp') {
      this.addERPDetails(details, item);
    } else if (this.selectedCategory === 'applications') {
      this.addApplicationDetails(details, item);
    } else if (this.selectedCategory === 'app-modules') {
      this.addAppModuleDetails(details, item);
    } else if (this.selectedCategory === 'erp-modules') {
      this.addERPModuleDetails(details, item);
    } else if (this.selectedCategory === 'logs') {
      this.addLogDetails(details, item);
    } else {
      this.addGenericDetails(details, item);
    }
    
    return details;
  }

  addFluxDetails(details: {label: string, value: string}[], flux: any): void {
    if (flux.nomFlux) details.push({label: 'Nom', value: flux.nomFlux});
    if (flux.typeFlux) details.push({label: 'Type', value: flux.typeFlux});
    if (flux.statut) details.push({label: 'Statut', value: flux.statut});
    if (flux.archived !== undefined) details.push({label: 'Archivé', value: flux.archived ? 'Oui' : 'Non'});
    if (flux.validated !== undefined) details.push({label: 'Validé', value: flux.validated ? 'Oui' : 'Non'});
    if (flux.cancelled !== undefined) details.push({label: 'Annulé', value: flux.cancelled ? 'Oui' : 'Non'});
    if (flux.dateCreation) details.push({label: 'Date de création', value: new Date(flux.dateCreation).toLocaleDateString()});
    if (flux.modifiedBy) details.push({label: 'Modifié par', value: flux.modifiedBy});
  }

  addReportDetails(details: {label: string, value: string}[], report: any): void {
    if (report.nom) details.push({label: 'Nom', value: report.nom});
    if (report.type) details.push({label: 'Type', value: report.type});
    if (report.statut) details.push({label: 'Statut', value: report.statut});
    if (report.dateCreation) details.push({label: 'Date de création', value: new Date(report.dateCreation).toLocaleDateString()});
    if (report.description) details.push({label: 'Description', value: report.description});
  }

  addLogDetails(details: {label: string, value: string}[], log: any): void {
    if (log.message) details.push({label: 'Message', value: log.message});
    if (log.level) details.push({label: 'Niveau', value: log.level});
    if (log.timestamp) details.push({label: 'Horodatage', value: new Date(log.timestamp).toLocaleString()});
    if (log.source) details.push({label: 'Source', value: log.source});
    if (log.user) details.push({label: 'Utilisateur', value: log.user});
    if (log.action) details.push({label: 'Action', value: log.action});
    if (log.status) details.push({label: 'Statut', value: log.status});
  }

  addERPDetails(details: {label: string, value: string}[], erp: any): void {
    if (erp.nom) details.push({label: 'Nom', value: erp.nom});
    if (erp.description) details.push({label: 'Description', value: erp.description});
    if (erp.version) details.push({label: 'Version', value: erp.version});
    if (erp.logoUrl) details.push({label: 'Logo', value: erp.logoUrl});
  }

  addApplicationDetails(details: {label: string, value: string}[], app: any): void {
    if (app.nom) details.push({label: 'Nom', value: app.nom});
    if (app.description) details.push({label: 'Description', value: app.description});
    if (app.version) details.push({label: 'Version', value: app.version});
    if (app.logoUrl) details.push({label: 'Logo', value: app.logoUrl});
  }

  addAppModuleDetails(details: {label: string, value: string}[], module: any): void {
    if (module.nom) details.push({label: 'Nom', value: module.nom});
    if (module.typeModule) details.push({label: 'Type', value: module.typeModule});
    if (module.description) details.push({label: 'Description', value: module.description});
    if (module.actif !== undefined) details.push({label: 'Actif', value: module.actif ? 'Oui' : 'Non'});
    if (module.applicationOpenSource?.nom) details.push({label: 'Application', value: module.applicationOpenSource.nom});
  }

  addERPModuleDetails(details: {label: string, value: string}[], module: any): void {
    if (module.nom) details.push({label: 'Nom', value: module.nom});
    if (module.typeModule) details.push({label: 'Type', value: module.typeModule});
    if (module.description) details.push({label: 'Description', value: module.description});
    if (module.actif !== undefined) details.push({label: 'Actif', value: module.actif ? 'Oui' : 'Non'});
    if (module.erp?.nom) details.push({label: 'ERP', value: module.erp.nom});
  }

  addGenericDetails(details: {label: string, value: string}[], item: any): void {
    const commonProps = ['nom', 'name', 'description', 'type', 'status', 'statut', 'actif', 'dateCreation', 'createdAt'];
    
    commonProps.forEach(prop => {
      if (item[prop] !== undefined && item[prop] !== null) {
        const label = prop.charAt(0).toUpperCase() + prop.slice(1);
        let value = '';
        
        if (prop.includes('date') || prop.includes('Date')) {
          value = new Date(item[prop]).toLocaleDateString();
        } else if (typeof item[prop] === 'boolean') {
          value = item[prop] ? 'Oui' : 'Non';
        } else {
          value = item[prop].toString();
        }
        
        details.push({label, value});
      }
    });
  }

  getItemName(item: any): string {
    if (item.nomFlux) return item.nomFlux;
    if (item.nom) return item.nom;
    if (item.username) return item.username;
    if (item.email) return item.email;
    return 'Élément sans nom';
  }

  getItemDescription(item: any): string {
    if (this.selectedCategory === 'flux') {
      let desc = '';
      if (item.typeFlux) desc += `Type: ${item.typeFlux}`;
      if (item.statut) desc += (desc ? ' | ' : '') + `Statut: ${item.statut}`;
      if (item.archived !== undefined) desc += (desc ? ' | ' : '') + `Archivé: ${item.archived ? 'Oui' : 'Non'}`;
      return desc || 'Flux de données';
    } else if (this.selectedCategory === 'rapports') {
      let desc = '';
      if (item.type) desc += `Type: ${item.type}`;
      if (item.statut) desc += (desc ? ' | ' : '') + `Statut: ${item.statut}`;
      return desc || 'Rapport';
    } else if (this.selectedCategory === 'logs') {
      let desc = '';
      if (item.level) desc += `Niveau: ${item.level}`;
      if (item.source) desc += (desc ? ' | ' : '') + `Source: ${item.source}`;
      if (item.action) desc += (desc ? ' | ' : '') + `Action: ${item.action}`;
      return desc || 'Log';
    } else if (this.selectedCategory === 'erp') {
      let desc = '';
      if (item.description) desc += item.description;
      if (item.version) desc += (desc ? ' | ' : '') + `Version: ${item.version}`;
      return desc || 'Système ERP';
    } else if (this.selectedCategory === 'applications') {
      let desc = '';
      if (item.description) desc += item.description;
      if (item.version) desc += (desc ? ' | ' : '') + `Version: ${item.version}`;
      return desc || 'Application Open Source';
    } else if (this.selectedCategory === 'app-modules') {
      let desc = '';
      if (item.typeModule) desc += `Type: ${item.typeModule}`;
      if (item.description) desc += (desc ? ' | ' : '') + item.description;
      return desc || 'Module d\'application';
    } else if (this.selectedCategory === 'erp-modules') {
      let desc = '';
      if (item.typeModule) desc += `Type: ${item.typeModule}`;
      if (item.description) desc += (desc ? ' | ' : '') + item.description;
      return desc || 'Module ERP';
    }
    
    if (item.description) return item.description;
    if (item.email) return item.email;
    if (item.typeFlux) return `Type: ${item.typeFlux}`;
    if (item.type) return `Type: ${item.type}`;
    if (item.version) return `Version: ${item.version}`;
    return 'Aucune description disponible';
  }

  refreshStatistics(): void {
    console.log('Actualisation des statistiques...');
    this.loadUserStatistics();
  }

  logout(): void {
    this.eventBusService.emit({ name: 'logout', value: null }); 
  }
}
