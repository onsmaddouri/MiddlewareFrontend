import { Component, OnInit } from '@angular/core';
import { ConnecteurService } from '../_services/connecteur.service';
import { ApplicationOpenSourceService } from '../_services/application-open-source.service';
import { ERPService } from '../_services/erp.service';
declare var bootstrap: any;

@Component({
  selector: 'app-connecteurs',
  templateUrl: './connecteurs.component.html',
  styleUrls: ['./connecteurs.component.css']
})
export class ConnecteursComponent implements OnInit {
  connecteurs: any[] = [];
  filteredConnecteurs: any[] = [];
  editingId: number | null = null;
  editedConnecteur: any = null;

  applications: any[] = [];
  erps: any[] = [];

  search = {
    nom: '',
    type: '',
    statut: '',
    applicationOpenSource: '',
    erp: ''
  };

  connecteurToDelete: any = null;
  deleteModal: any;

  newConnecteur: any = {
    nom: '',
    type: '',
    configuration: '',
    statut: '',
    applicationOpenSource: null,
    erp: null
  };
  addModal: any;

  constructor(
    private connecteurService: ConnecteurService,
    private applicationOpenSourceService: ApplicationOpenSourceService,
    private erpService: ERPService
  ) {}

  ngOnInit(): void {
    this.loadConnecteurs();
    this.applicationOpenSourceService.getAll().subscribe(data => this.applications = data);
    this.erpService.getAll().subscribe(data => this.erps = data);
    const modalElement = document.getElementById('deleteConnecteurModal');
    if (modalElement) {
      this.deleteModal = new bootstrap.Modal(modalElement);
    }
  }

  loadConnecteurs() {
    this.connecteurService.getAll().subscribe(data => {
      this.connecteurs = data;
      this.filteredConnecteurs = data;
    });
  }

  onSearch() {
    this.filteredConnecteurs = this.connecteurs.filter(c => {
      const matchNom = !this.search.nom || (c.nom && c.nom.toLowerCase().includes(this.search.nom.toLowerCase()));
      const matchType = !this.search.type || (c.type && c.type.toLowerCase().includes(this.search.type.toLowerCase()));
      const matchStatut = !this.search.statut || (c.statut && c.statut.toLowerCase().includes(this.search.statut.toLowerCase()));
      const matchApp = !this.search.applicationOpenSource || (c.applicationOpenSource && c.applicationOpenSource.nom && c.applicationOpenSource.nom.toLowerCase().includes(this.search.applicationOpenSource.toLowerCase()));
      const matchErp = !this.search.erp || (c.erp && c.erp.nom && c.erp.nom.toLowerCase().includes(this.search.erp.toLowerCase()));
      return matchNom && matchType && matchStatut && matchApp && matchErp;
    });
  }

  atLeastOneFilled(): boolean {
    return Object.values(this.search).some(val => val && val.trim() !== '');
  }

  startEditing(connecteur: any) {
    this.editingId = connecteur.id;
    this.editedConnecteur = { ...connecteur };
  }

  saveEdit() {
    if (this.editedConnecteur) {
      this.connecteurService.update(this.editedConnecteur.id, this.editedConnecteur).subscribe(() => {
        this.loadConnecteurs();
        this.editingId = null;
        this.editedConnecteur = null;
      });
    }
  }

  cancelEdit() {
    this.editingId = null;
    this.editedConnecteur = null;
  }

  openDeleteModal(connecteur: any) {
    this.connecteurToDelete = connecteur;
    if (!this.deleteModal) {
      const modalElement = document.getElementById('deleteConnecteurModal');
      if (modalElement) {
        this.deleteModal = new bootstrap.Modal(modalElement);
      }
    }
    if (this.deleteModal) {
      this.deleteModal.show();
    }
  }

  confirmDelete() {
    if (this.connecteurToDelete) {
      this.connecteurService.delete(this.connecteurToDelete.id).subscribe(() => {
        this.loadConnecteurs();
        this.deleteModal.hide();
        this.connecteurToDelete = null;
      });
    }
  }

  cancelDelete() {
    if (this.deleteModal) {
      this.deleteModal.hide();
    }
    this.connecteurToDelete = null;
  }

  openAddModal() {
    if (!this.addModal) {
      const addModalElement = document.getElementById('addConnecteurModal');
      if (addModalElement) {
        this.addModal = new bootstrap.Modal(addModalElement);
      }
    }
    if (this.addModal) {
      this.addModal.show();
    }
  }

  submitAddConnecteur() {
    this.connecteurService.add(this.newConnecteur).subscribe(() => {
      this.loadConnecteurs();
      this.addModal.hide();
      this.newConnecteur = { nom: '', type: '', configuration: '', statut: '', applicationOpenSource: null, erp: null };
    });
  }

  cancelAddConnecteurModal() {
    if (this.addModal) {
      this.addModal.hide();
    }
    this.newConnecteur = { nom: '', type: '', configuration: '', statut: '', applicationOpenSource: null, erp: null };
  }
}
