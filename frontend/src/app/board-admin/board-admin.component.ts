import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { EventBusService } from '../_shared/event-bus.service';
import { FluxService } from '../_services/flux.service';
import { GenerateurFluxService } from '../_services/generateur-flux.service';
import { ConnecteurService } from '../_services/connecteur.service';
import { ERPService } from '../_services/erp.service';

@Component({
  selector: 'app-board-admin',
  templateUrl: './board-admin.component.html',
  styleUrls: ['./board-admin.component.css']
})
export class BoardAdminComponent implements OnInit {
  content?: string;
  userCount: number = 0;
  fluxCount: number = 0;
  generateurCount: number = 0;
  connecteurCount: number = 0;
  erpCount: number = 0;

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
    private generateurFluxService: GenerateurFluxService,
    private connecteurService: ConnecteurService,
    private erpService: ERPService
  ) {}

  ngOnInit(): void {
    this.userService.getAdminBoard().subscribe({
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

    // Charger toutes les statistiques
    this.loadStatistics();
  }

  loadStatistics(): void {
    // Statistiques utilisateurs
    this.userService.getCount().subscribe({
      next: count => {
        this.userCount = count;
      },
      error: err => {
        console.error('Error fetching user count:', err);
      }
    });

    // Statistiques flux
    this.fluxService.getCount().subscribe({
      next: count => {
        this.fluxCount = count;
      },
      error: err => {
        console.error('Error fetching flux count:', err);
      }
    });

    // Statistiques générateurs de flux
    this.generateurFluxService.getCount().subscribe({
      next: count => {
        this.generateurCount = count;
      },
      error: err => {
        console.error('Error fetching generateur count:', err);
      }
    });

    // Statistiques connecteurs
    this.connecteurService.getCount().subscribe({
      next: count => {
        this.connecteurCount = count;
      },
      error: err => {
        console.error('Error fetching connecteur count:', err);
      }
    });

    // Statistiques ERP
    this.erpService.getCount().subscribe({
      next: count => {
        this.erpCount = count;
      },
      error: err => {
        console.error('Error fetching ERP count:', err);
      }
    });
  }

  logout(): void {
    this.eventBusService.emit({ name: 'logout', value: null });
  }

  // Méthodes selon le Use Case Diagram
  manageUserRights(): void {
    // Redirection vers la gestion des utilisateurs
    window.location.href = '/admin/users';
  }

  consultLogs(): void {
    // Redirection vers la consultation des logs
    window.location.href = '/admin/logs';
  }

  manageErrors(): void {
    // Redirection vers la gestion des erreurs
    window.location.href = '/admin/errors';
  }

  // Méthodes pour la carte d'information
  onStatCardClick(category: string): void {
    this.selectedCategory = category;
    this.loadingDetails = true;
    this.showInfoCard = true;

    switch (category) {
      case 'users':
        this.infoCardTitle = 'Liste des Utilisateurs';
        this.loadUsersDetails();
        break;
      case 'flux':
        this.infoCardTitle = 'Liste des Flux de Données';
        this.loadFluxDetails();
        break;
      case 'connecteurs':
        this.infoCardTitle = 'Liste des Connecteurs';
        this.loadConnecteursDetails();
        break;
      case 'generateurs':
        this.infoCardTitle = 'Liste des Générateurs';
        this.loadGenerateursDetails();
        break;
      case 'erp':
        this.infoCardTitle = 'Liste des Systèmes ERP';
        this.loadERPDetails();
        break;
    }
  }

  loadUsersDetails(): void {
    this.userService.getAll().subscribe({
      next: (users) => {
        this.infoCardData = users;
        this.loadingDetails = false;
      },
      error: (err) => {
        console.error('Error loading users details:', err);
        this.loadingDetails = false;
      }
    });
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

  loadConnecteursDetails(): void {
    this.connecteurService.getAll().subscribe({
      next: (connecteurs) => {
        this.infoCardData = connecteurs;
        this.loadingDetails = false;
      },
      error: (err) => {
        console.error('Error loading connecteurs details:', err);
        this.loadingDetails = false;
      }
    });
  }

  loadGenerateursDetails(): void {
    this.generateurFluxService.getAll().subscribe({
      next: (generateurs) => {
        this.infoCardData = generateurs;
        this.loadingDetails = false;
      },
      error: (err) => {
        console.error('Error loading generateurs details:', err);
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

  closeInfoCard(): void {
    this.showInfoCard = false;
    this.selectedCategory = '';
    this.infoCardTitle = '';
    this.infoCardData = [];
  }

  showItemDetails(item: any): void {
    // Afficher les détails d'un élément spécifique
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
    
    // Afficher les attributs selon le type d'élément
    if (this.selectedCategory === 'users') {
      this.addUserDetails(details, item);
    } else if (this.selectedCategory === 'flux') {
      this.addFluxDetails(details, item);
    } else if (this.selectedCategory === 'connecteurs') {
      this.addConnecteurDetails(details, item);
    } else if (this.selectedCategory === 'generateurs') {
      this.addGenerateurDetails(details, item);
    } else if (this.selectedCategory === 'erp') {
      this.addERPDetails(details, item);
    } else {
      // Format générique pour les autres types
      this.addGenericDetails(details, item);
    }
    
    return details;
  }

  addUserDetails(details: {label: string, value: string}[], user: any): void {
    if (user.username) details.push({label: 'Nom d\'utilisateur', value: user.username});
    if (user.email) details.push({label: 'Email', value: user.email});
    if (user.roles && user.roles.length > 0) {
      details.push({label: 'Rôles', value: user.roles.map((role: any) => role.name || role).join(', ')});
    }
    if (user.createdAt) details.push({label: 'Date de création', value: new Date(user.createdAt).toLocaleDateString()});
    if (user.updatedAt) details.push({label: 'Dernière modification', value: new Date(user.updatedAt).toLocaleDateString()});
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
    if (flux.sourceErpModule?.nom) details.push({label: 'Source ERP', value: flux.sourceErpModule.nom});
    if (flux.sourceAppModule?.nom) details.push({label: 'Source App', value: flux.sourceAppModule.nom});
    if (flux.destinationErpModule?.nom) details.push({label: 'Destination ERP', value: flux.destinationErpModule.nom});
    if (flux.destinationAppModule?.nom) details.push({label: 'Destination App', value: flux.destinationAppModule.nom});
  }

  addConnecteurDetails(details: {label: string, value: string}[], connecteur: any): void {
    if (connecteur.nom) details.push({label: 'Nom', value: connecteur.nom});
    if (connecteur.type) details.push({label: 'Type', value: connecteur.type});
    if (connecteur.protocole) details.push({label: 'Protocole', value: connecteur.protocole});
    if (connecteur.urlEndpoint) details.push({label: 'URL', value: connecteur.urlEndpoint});
    if (connecteur.statut) details.push({label: 'Statut', value: connecteur.statut});
    if (connecteur.actif !== undefined) details.push({label: 'Actif', value: connecteur.actif ? 'Oui' : 'Non'});
    if (connecteur.timeout) details.push({label: 'Timeout', value: `${connecteur.timeout}ms`});
    if (connecteur.maxRetries) details.push({label: 'Tentatives max', value: connecteur.maxRetries.toString()});
    if (connecteur.dateCreation) details.push({label: 'Date de création', value: new Date(connecteur.dateCreation).toLocaleDateString()});
    if (connecteur.erp?.nom) details.push({label: 'ERP associé', value: connecteur.erp.nom});
    if (connecteur.applicationOpenSource?.nom) details.push({label: 'App Open Source', value: connecteur.applicationOpenSource.nom});
  }

  addGenerateurDetails(details: {label: string, value: string}[], generateur: any): void {
    if (generateur.nom) details.push({label: 'Nom', value: generateur.nom});
    if (generateur.description) details.push({label: 'Description', value: generateur.description});
    if (generateur.source) details.push({label: 'Source', value: generateur.source});
    if (generateur.destination) details.push({label: 'Destination', value: generateur.destination});
    if (generateur.format) details.push({label: 'Format', value: generateur.format});
    if (generateur.dateCreation) details.push({label: 'Date de création', value: new Date(generateur.dateCreation).toLocaleDateString()});
  }

  addERPDetails(details: {label: string, value: string}[], erp: any): void {
    if (erp.nom) details.push({label: 'Nom', value: erp.nom});
    if (erp.description) details.push({label: 'Description', value: erp.description});
    if (erp.version) details.push({label: 'Version', value: erp.version});
    if (erp.logoUrl) details.push({label: 'Logo', value: erp.logoUrl});
  }

  addGenericDetails(details: {label: string, value: string}[], item: any): void {
    // Afficher les propriétés les plus communes
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
    if (item.username) return item.username;
    if (item.nomFlux) return item.nomFlux;
    if (item.nom) return item.nom;
    if (item.email) return item.email;
    return 'Élément sans nom';
  }

  getItemDescription(item: any): string {
    // Description spécifique selon le type d'élément
    if (this.selectedCategory === 'users') {
      if (item.email) return item.email;
      if (item.roles && item.roles.length > 0) {
        return `Rôles: ${item.roles.map((role: any) => role.name || role).join(', ')}`;
      }
      return 'Utilisateur';
    } else if (this.selectedCategory === 'flux') {
      let desc = '';
      if (item.typeFlux) desc += `Type: ${item.typeFlux}`;
      if (item.statut) desc += (desc ? ' | ' : '') + `Statut: ${item.statut}`;
      if (item.archived !== undefined) desc += (desc ? ' | ' : '') + `Archivé: ${item.archived ? 'Oui' : 'Non'}`;
      return desc || 'Flux de données';
    } else if (this.selectedCategory === 'connecteurs') {
      let desc = '';
      if (item.type) desc += `Type: ${item.type}`;
      if (item.protocole) desc += (desc ? ' | ' : '') + `Protocole: ${item.protocole}`;
      if (item.statut) desc += (desc ? ' | ' : '') + `Statut: ${item.statut}`;
      return desc || 'Connecteur';
    } else if (this.selectedCategory === 'generateurs') {
      let desc = '';
      if (item.description) desc += item.description;
      if (item.format) desc += (desc ? ' | ' : '') + `Format: ${item.format}`;
      return desc || 'Générateur de flux';
    } else if (this.selectedCategory === 'erp') {
      let desc = '';
      if (item.description) desc += item.description;
      if (item.version) desc += (desc ? ' | ' : '') + `Version: ${item.version}`;
      return desc || 'Système ERP';
    }
    
    // Format générique
    if (item.description) return item.description;
    if (item.email) return item.email;
    if (item.typeFlux) return `Type: ${item.typeFlux}`;
    if (item.type) return `Type: ${item.type}`;
    if (item.version) return `Version: ${item.version}`;
    return 'Aucune description disponible';
  }
} 