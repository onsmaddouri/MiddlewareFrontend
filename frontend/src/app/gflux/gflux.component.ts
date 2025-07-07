import { Component, OnInit } from '@angular/core';
import { FluxService } from 'src/app/_services/flux.service';
import { Router } from '@angular/router';
import { StorageService } from '../_services/storage.service';
import { HttpClient } from '@angular/common/http';
import { ConnecteurService } from '../_services/connecteur.service';
import { GenerateurFluxService } from '../_services/generateur-flux.service';
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

  newFlux: any = {
    nomFlux: '',
    typeFlux: '',
    connecteur: null,
    generateurFlux: null
  };
  today: Date = new Date();

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

    const modalElement = document.getElementById('deleteConfirmModal');
    if (modalElement) {
      this.deleteModal = new bootstrap.Modal(modalElement);
    }
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
    const adminName = this.storageService.getUser()?.username || 'admin';
    this.fluxService.archiveFlux(flux.idFlux, adminName).subscribe({
      next: () => this.loadFlux(),
      error: err => console.error('Erreur lors de l\'archivage :', err)
    });
  }

  validateFlux(flux: any) {
    const adminName = this.storageService.getUser()?.username || 'admin';
    this.fluxService.validateFlux(flux.idFlux, adminName).subscribe({
      next: () => this.loadFlux(),
      error: err => console.error('Erreur lors de la validation :', err)
    });
  }

  cancelFlux(flux: any) {
    const adminName = this.storageService.getUser()?.username || 'admin';
    this.fluxService.cancelFlux(flux.idFlux, adminName).subscribe({
      next: () => this.loadFlux(),
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
      connecteur: null,
      generateurFlux: null
    };
    const modal = new (window as any).bootstrap.Modal(document.getElementById('addFluxModal'));
    modal.show();
  }

  submitAddFlux() {
    const fluxToAdd = {
      ...this.newFlux,
      dateCreation: this.today,
      statut: 'EN_ATTENTE',
      connecteur: this.newFlux.connecteur,
      generateurFlux: this.newFlux.generateurFlux
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
      const matchConnecteur = !this.search.connecteur || (flux.connecteur?.nomConnecteur && flux.connecteur.nomConnecteur.toLowerCase().includes(this.search.connecteur.toLowerCase()));
      const matchGenerateur = !this.search.generateur || (flux.generateurFlux?.nomGenerateur && flux.generateurFlux.nomGenerateur.toLowerCase().includes(this.search.generateur.toLowerCase()));
      return matchNom && matchStatut && matchDate && matchConnecteur && matchGenerateur;
    });
  }

  atLeastOneFilled(): boolean {
    return Object.values(this.search).some(val => val && val.trim() !== '');
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
