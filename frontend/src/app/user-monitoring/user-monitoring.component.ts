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
        const currentUser = this.storageService.getUser();
        const username = currentUser?.username || currentUser?.email || 'unknown';
        
        // Filtrer les flux de l'utilisateur connecté
        this.userFluxes = data
          .filter(flux => {
            // Filtrer par utilisateur qui a créé ou modifié le flux
            return flux.modifiedBy === username || 
                   flux.createdBy === username || 
                   flux.user?.username === username;
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
        console.log(`Flux de l'utilisateur ${username}:`, this.userFluxes);
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
    return this.userFluxes.filter(flux => 
      flux.statut === 'EN_COURS' || flux.statut === 'EN_ATTENTE'
    ).length;
  }

  getCompletedFluxCount(): number {
    return this.userFluxes.filter(flux => flux.statut === 'TERMINE').length;
  }

  getFailedFluxCount(): number {
    return this.userFluxes.filter(flux => flux.statut === 'ECHEC').length;
  }
}
