import { Component, OnInit, OnDestroy } from '@angular/core';
import { FluxService } from '../_services/flux.service';
import { StorageService } from '../_services/storage.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-user-monitoring',
  templateUrl: './user-monitoring.component.html',
  styleUrls: ['./user-monitoring.component.css']
})
export class UserMonitoringComponent implements OnInit, OnDestroy {
  fluxes: any[] = [];
  userFluxes: any[] = [];
  loading: boolean = false;
  autoRefresh: boolean = true;
  refreshInterval: number = 5000; // 5 secondes
  private refreshSubscription?: Subscription;

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
    private fluxService: FluxService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.loadUserFluxes();
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    this.stopAutoRefresh();
  }

  loadUserFluxes(): void {
    this.loading = true;
    this.fluxService.getAllFlux().subscribe({
      next: (data: any[]) => {
        // ✅ CORRECTION : Assigner tous les flux à this.fluxes
        this.fluxes = data;
        
        const currentUser = this.storageService.getUser();
        const username = currentUser?.username || currentUser?.email || 'unknown';
        
        console.log('Tous les flux chargés:', this.fluxes.length);
        console.log('Utilisateur connecté:', username);
        console.log('Données brutes des flux:', data);
        
        // Filtrer les flux de l'utilisateur connecté
        this.userFluxes = data
          .filter(flux => {
            // Filtrer par utilisateur qui a créé ou modifié le flux
            const isUserFlux = flux.modifiedBy === username || 
                              flux.createdBy === username || 
                              flux.user?.username === username ||
                              flux.user?.email === username;
            
            console.log(`Flux "${flux.nomFlux}": modifiedBy=${flux.modifiedBy}, createdBy=${flux.createdBy}, user.username=${flux.user?.username}, isUserFlux=${isUserFlux}`);
            
            return isUserFlux;
          })
          .map(flux => ({
            id: flux.idFlux || flux.id,
            nomFlux: flux.nomFlux || flux.nom,
            statut: flux.statut,
            dateCreation: new Date(flux.dateCreation),
            progression: this.calculateProgression(flux.statut),
            connecteur: flux.connecteur?.nomConnecteur || flux.connecteur?.nom || 'N/A',
            derniereExecution: flux.derniereExecution ? new Date(flux.derniereExecution) : null,
            modifiedBy: flux.modifiedBy,
            createdBy: flux.createdBy,
            typeFlux: flux.typeFlux,
            archived: flux.archived,
            validated: flux.validated,
            cancelled: flux.cancelled,
            generateur: flux.generateurFlux?.nomGenerateur || 'N/A'
          }));
        
        this.loading = false;
        console.log(`Flux totaux: ${this.fluxes.length}`);
        console.log(`Flux de l'utilisateur ${username}: ${this.userFluxes.length}`, this.userFluxes);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des flux:', error);
        this.loading = false;
      }
    });
  }

  startAutoRefresh(): void {
    if (this.autoRefresh) {
      this.refreshSubscription = interval(this.refreshInterval).subscribe(() => {
        this.loadUserFluxes();
      });
    }
  }

  stopAutoRefresh(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  toggleAutoRefresh(): void {
    this.autoRefresh = !this.autoRefresh;
    if (this.autoRefresh) {
      this.startAutoRefresh();
    } else {
      this.stopAutoRefresh();
    }
  }

  manualRefresh(): void {
    this.loadUserFluxes();
  }

  private calculateProgression(statut: string): number {
    switch (statut) {
      case 'EN_ATTENTE': return 0;
      case 'EN_COURS': return 50;
      case 'TERMINE': return 100;
      case 'ECHEC': return 0;
      default: return 0;
    }
  }

  getStatusClass(statut: string): string {
    switch (statut) {
      case 'EN_COURS': return 'badge-info';
      case 'TERMINE': return 'badge-success';
      case 'EN_ATTENTE': return 'badge-warning';
      case 'ECHEC': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }

  getStatusText(statut: string): string {
    switch (statut) {
      case 'EN_COURS': return 'En Cours';
      case 'TERMINE': return 'Terminé';
      case 'EN_ATTENTE': return 'En Attente';
      case 'ECHEC': return 'Échec';
      default: return statut;
    }
  }

  getCurrentUser(): string {
    const currentUser = this.storageService.getUser();
    return currentUser?.username || currentUser?.email || 'Utilisateur inconnu';
  }

  getFluxCount(): number {
    return this.userFluxes.length;
  }

  getActiveFluxCount(): number {
    return this.fluxes.filter(flux => 
      flux.statut === 'EN_COURS' || flux.statut === 'EN_ATTENTE'
    ).length;
  }

  getCompletedFluxCount(): number {
    return this.fluxes.filter(flux => flux.statut === 'TERMINE').length;
  }

  getFailedFluxCount(): number {
    return this.fluxes.filter(flux => flux.statut === 'ECHEC').length;
  }

  getTotalFluxCount(): number {
    return this.fluxes.length; // Tous les flux du système, pas seulement ceux de l'utilisateur
  }

  // Méthodes pour la carte d'information
  onStatCardClick(category: string): void {
    this.selectedCategory = category;
    this.loadingDetails = true;
    this.showInfoCard = true;

    switch (category) {
      case 'total':
        this.infoCardTitle = 'Tous mes Flux';
        this.loadTotalFluxDetails();
        break;
      case 'system-total':
        this.infoCardTitle = 'Tous les Flux du Système';
        this.loadSystemTotalFluxDetails();
        break;
      case 'active':
        this.infoCardTitle = 'Flux Actifs';
        this.loadActiveFluxDetails();
        break;
      case 'completed':
        this.infoCardTitle = 'Flux Terminés';
        this.loadCompletedFluxDetails();
        break;
      case 'failed':
        this.infoCardTitle = 'Flux Échoués';
        this.loadFailedFluxDetails();
        break;
    }
  }

  loadTotalFluxDetails(): void {
    this.infoCardData = this.userFluxes;
    this.loadingDetails = false;
  }

  loadSystemTotalFluxDetails(): void {
    this.infoCardData = this.fluxes;
    this.loadingDetails = false;
  }

  loadActiveFluxDetails(): void {
    this.infoCardData = this.fluxes.filter(flux => 
      flux.statut === 'EN_COURS' || flux.statut === 'EN_ATTENTE'
    );
    this.loadingDetails = false;
  }

  loadCompletedFluxDetails(): void {
    this.infoCardData = this.fluxes.filter(flux => flux.statut === 'TERMINE');
    this.loadingDetails = false;
  }

  loadFailedFluxDetails(): void {
    this.infoCardData = this.fluxes.filter(flux => flux.statut === 'ECHEC');
    this.loadingDetails = false;
  }

  closeInfoCard(): void {
    this.showInfoCard = false;
    this.infoCardData = [];
    this.selectedCategory = '';
  }

  showItemDetails(item: any): void {
    this.selectedItemName = item.nomFlux || item.nom || 'Flux';
    this.selectedItemDetails = this.getFormattedDetails(item);
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedItemDetails = [];
  }

  getFormattedDetails(item: any): {label: string, value: string}[] {
    const details: {label: string, value: string}[] = [];
    
    if (item.nomFlux) details.push({label: 'Nom du flux', value: item.nomFlux});
    if (item.typeFlux) details.push({label: 'Type', value: item.typeFlux});
    if (item.statut) details.push({label: 'Statut', value: this.getStatusText(item.statut)});
    if (item.dateCreation) details.push({label: 'Date de création', value: new Date(item.dateCreation).toLocaleString()});
    if (item.connecteur) details.push({label: 'Connecteur', value: item.connecteur});
    if (item.generateur) details.push({label: 'Générateur', value: item.generateur});
    if (item.modifiedBy) details.push({label: 'Modifié par', value: item.modifiedBy});
    if (item.createdBy) details.push({label: 'Créé par', value: item.createdBy});
    if (item.derniereExecution) details.push({label: 'Dernière exécution', value: new Date(item.derniereExecution).toLocaleString()});
    if (item.archived !== undefined) details.push({label: 'Archivé', value: item.archived ? 'Oui' : 'Non'});
    if (item.validated !== undefined) details.push({label: 'Validé', value: item.validated ? 'Oui' : 'Non'});
    if (item.cancelled !== undefined) details.push({label: 'Annulé', value: item.cancelled ? 'Oui' : 'Non'});
    
    return details;
  }

  getItemName(item: any): string {
    return item.nomFlux || item.nom || 'Flux sans nom';
  }

  getItemDescription(item: any): string {
    let desc = '';
    if (item.typeFlux) desc += `Type: ${item.typeFlux}`;
    if (item.statut) desc += (desc ? ' | ' : '') + `Statut: ${this.getStatusText(item.statut)}`;
    if (item.connecteur) desc += (desc ? ' | ' : '') + `Connecteur: ${item.connecteur}`;
    return desc || 'Aucune description';
  }
}
