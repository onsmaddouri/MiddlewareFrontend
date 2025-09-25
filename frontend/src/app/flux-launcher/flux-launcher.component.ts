import { Component, OnInit } from '@angular/core';
import { FluxService } from 'src/app/_services/flux.service';
import { Router } from '@angular/router';
import { StorageService } from '../_services/storage.service';
import { HttpClient } from '@angular/common/http';
import { ConnecteurService } from '../_services/connecteur.service';
import { GenerateurFluxService } from '../_services/generateur-flux.service';

@Component({
  selector: 'app-flux-launcher',
  templateUrl: './flux-launcher.component.html',
  styleUrls: ['./flux-launcher.component.css']
})
export class FluxLauncherComponent implements OnInit{
  fluxList: any[] = [];

  search = {
    nomFlux: '',
    statut: '',
    dateCreation: '',
    connecteur: '',
    generateur: ''
  };

  filteredFluxList: any[] = [];

  connecteurs: any[] = [];
  generateurs: any[] = [];

  constructor(
    private http: HttpClient,
    private fluxService: FluxService,
    private storageService: StorageService,
    private router: Router,
    private connecteurService: ConnecteurService,
    private generateurFluxService: GenerateurFluxService
  ) {}

  ngOnInit(): void {
    this.loadFlux();
    this.connecteurService.getAll().subscribe(data => this.connecteurs = data);
    this.generateurFluxService.getAll().subscribe(data => this.generateurs = data);
  }

  loadFlux(): void {
    this.fluxService.getAllFlux().subscribe(
      data => {
        this.fluxList = data;
        this.filteredFluxList = data;
        console.log('Flux chargés : ', this.fluxList);
      },
      error => {
        console.error('Erreur lors du chargement des flux :', error);
      }
    );
  }

  launchFlux(fluxId: number): void {
    // Simuler le lancement du flux
    console.log(`Lancement du flux ID: ${fluxId}`);
    
    // Ici vous pouvez appeler le service pour lancer le flux
    // this.fluxService.launchFlux(fluxId).subscribe({
    //   next: (result) => {
    //     console.log('Flux lancé avec succès:', result);
    //     this.loadFlux();
    //   },
    //   error: (error) => {
    //     console.error('Erreur lors du lancement du flux:', error);
    //   }
    // });

    // Simulation temporaire
    const flux = this.fluxList.find(f => f.idFlux === fluxId);
    if (flux) {
      alert(`Flux "${flux.nomFlux}" lancé avec succès !`);
      this.loadFlux(); // Rafraîchir pour voir le changement de statut
    }
  }

  launchAllActiveFlux(): void {
    const activeFluxes = this.fluxList.filter(flux => 
      flux.statut === 'EN_ATTENTE' || flux.statut === 'TERMINE'
    );
    
    if (activeFluxes.length === 0) {
      alert('Aucun flux actif à lancer');
      return;
    }

    if (confirm(`Voulez-vous lancer ${activeFluxes.length} flux(s) actif(s) ?`)) {
      console.log('Lancement de tous les flux actifs');
      
      // Ici vous pouvez appeler le service pour lancer tous les flux actifs
      // activeFluxes.forEach(flux => {
      //   this.fluxService.launchFlux(flux.idFlux).subscribe({
      //     next: (result) => console.log(`Flux ${flux.nomFlux} lancé`),
      //     error: (error) => console.error(`Erreur flux ${flux.nomFlux}:`, error)
      //   });
      // });

      alert(`${activeFluxes.length} flux(s) lancé(s) avec succès !`);
      this.loadFlux();
    }
  }

  logout(): void {
    this.storageService.clean();
    this.router.navigate(['/home']);
  }

  onSearch() {
    this.filteredFluxList = this.fluxList.filter(flux => {
      const matchNom = !this.search.nomFlux || (flux.nomFlux && flux.nomFlux.toLowerCase().includes(this.search.nomFlux.toLowerCase()));
      const matchStatut = !this.search.statut || flux.statut === this.search.statut;
      const matchDate = !this.search.dateCreation || (flux.dateCreation && flux.dateCreation.startsWith(this.search.dateCreation));
      const matchConnecteur = !this.search.connecteur || (flux.connecteur?.nomConnecteur && flux.connecteur.nomConnecteur.toLowerCase().includes(this.search.connecteur.toLowerCase()));
      const matchGenerateur = !this.search.generateur || (flux.generateurFlux?.nomGenerateur && flux.generateurFlux.nomGenerateur.toLowerCase().includes(this.search.generateur.toLowerCase()));
      return matchNom && matchStatut && matchDate && matchConnecteur && matchGenerateur;
    });
  }

  atLeastOneFilled(): boolean {
    return Object.values(this.search).some(val => val && val.trim() !== '');
  }
}
