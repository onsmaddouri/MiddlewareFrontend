import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { EventBusService } from '../_shared/event-bus.service';
import { FluxService } from '../_services/flux.service';
import { ReportService } from '../_services/report.service';
import { ConnecteurService } from '../_services/connecteur.service';
import { ERPService } from '../_services/erp.service';

@Component({
  selector: 'app-board-user',
  templateUrl: './board-user.component.html',
  styleUrls: ['./board-user.component.css']
})
export class BoardUserComponent implements OnInit {
  content?: string;
  loading: boolean = false;
  
  // Statistiques des flux
  activeFluxCount: number = 0;
  completedFluxCount: number = 0;
  failedFluxCount: number = 0;
  totalFluxCount: number = 0;
  
  // Statistiques des rapports
  reportsCount: number = 0;
  availableReportsCount: number = 0;
  
  // Statistiques des connecteurs
  totalConnecteursCount: number = 0;
  activeConnecteursCount: number = 0;
  
  // Statistiques des ERP
  totalERPsCount: number = 0;
  activeERPsCount: number = 0;

  constructor(
    private userService: UserService,
    private eventBusService: EventBusService,
    private fluxService: FluxService,
    private reportService: ReportService,
    private connecteurService: ConnecteurService,
    private erpService: ERPService
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
  }

  loadUserStatistics(): void {
    this.loading = true;
    
    // Charger les statistiques des flux
    this.loadFluxStatistics();
    
    // Charger les statistiques des rapports
    this.loadReportsStatistics();
    
    // Charger les statistiques des connecteurs
    this.loadConnecteursStatistics();
    
    // Charger les statistiques des ERP
    this.loadERPsStatistics();
  }

  loadFluxStatistics(): void {
    this.fluxService.getAllFlux().subscribe({
      next: (fluxes: any[]) => {
        this.totalFluxCount = fluxes.length;
        this.activeFluxCount = fluxes.filter((flux: any) => flux.statut === 'EN_COURS' || flux.statut === 'EN_ATTENTE').length;
        this.completedFluxCount = fluxes.filter((flux: any) => flux.statut === 'TERMINE').length;
        this.failedFluxCount = fluxes.filter((flux: any) => flux.statut === 'ECHEC').length;
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
        this.availableReportsCount = reports.filter((report: any) => 
          (report.statut || report.status) === 'DISPONIBLE'
        ).length;
        this.checkLoadingComplete();
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des statistiques de rapports:', err);
        this.checkLoadingComplete();
      }
    });
  }

  loadConnecteursStatistics(): void {
    this.connecteurService.getAll().subscribe({
      next: (connecteurs: any[]) => {
        this.totalConnecteursCount = connecteurs.length;
        this.activeConnecteursCount = connecteurs.filter((connecteur: any) => 
          connecteur.actif === true || connecteur.actif === 'true'
        ).length;
        this.checkLoadingComplete();
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des statistiques de connecteurs:', err);
        this.checkLoadingComplete();
      }
    });
  }

  loadERPsStatistics(): void {
    this.erpService.getAll().subscribe({
      next: (erps: any[]) => {
        this.totalERPsCount = erps.length;
        this.activeERPsCount = erps.filter((erp: any) => 
          erp.actif === true || erp.actif === 'true'
        ).length;
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

  refreshStatistics(): void {
    console.log('Actualisation des statistiques...');
    this.loadUserStatistics();
  }

  logout(): void {
    this.eventBusService.emit({ name: 'logout', value: null }); 
  }
}
