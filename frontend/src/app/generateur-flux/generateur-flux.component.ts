import { Component, OnInit } from '@angular/core';
import { GenerateurFluxService } from '../_services/generateur-flux.service';
import { ERPService } from '../_services/erp.service';
import { ApplicationOpenSourceService } from '../_services/application-open-source.service';
declare var bootstrap: any;

@Component({
  selector: 'app-generateur-flux',
  templateUrl: './generateur-flux.component.html',
  styleUrls: ['./generateur-flux.component.css']
})
export class GenerateurFluxComponent implements OnInit {
  generateurs: any[] = [];
  filteredGenerateurs: any[] = [];
  editingId: number | null = null;
  editedGenerateur: any = null;

  erps: any[] = [];
  applications: any[] = [];

  search = {
    nom: '',
    source: '',
    destination: '',
    format: ''
  };

  generateurToDelete: any = null;
  deleteModal: any;

  newGenerateur: any = {
    nom: '',
    description: '',
    source: '',
    destination: '',
    format: ''
  };
  addModal: any;

  constructor(
    private generateurService: GenerateurFluxService,
    private erpService: ERPService,
    private appOpenSourceService: ApplicationOpenSourceService
  ) {}

  ngOnInit(): void {
    this.loadGenerateurs();
    this.erpService.getAll().subscribe(data => this.erps = data);
    this.appOpenSourceService.getAll().subscribe(data => this.applications = data);
    const modalElement = document.getElementById('deleteGenerateurModal');
    if (modalElement) {
      this.deleteModal = new bootstrap.Modal(modalElement);
    }
    const addModalElement = document.getElementById('addGenerateurModal');
    if (addModalElement) {
      this.addModal = new bootstrap.Modal(addModalElement);
    }
  }

  loadGenerateurs() {
    this.generateurService.getAll().subscribe(data => {
      this.generateurs = data;
      this.filteredGenerateurs = data;
    });
  }

  onSearch() {
    this.filteredGenerateurs = this.generateurs.filter(g => {
      const matchNom = !this.search.nom || (g.nom && g.nom.toLowerCase().includes(this.search.nom.toLowerCase()));
      const matchSource = !this.search.source || (g.source && g.source.toLowerCase().includes(this.search.source.toLowerCase()));
      const matchDestination = !this.search.destination || (g.destination && g.destination.toLowerCase().includes(this.search.destination.toLowerCase()));
      const matchFormat = !this.search.format || (g.format && g.format.toLowerCase().includes(this.search.format.toLowerCase()));
      return matchNom && matchSource && matchDestination && matchFormat;
    });
  }

  atLeastOneFilled(): boolean {
    return Object.values(this.search).some(val => val && val.trim() !== '');
  }

  startEditing(g: any) {
    this.editingId = g.idGenerateur;
    this.editedGenerateur = { ...g };
  }

  saveEdit() {
    if (this.editedGenerateur) {
      this.generateurService.update(this.editedGenerateur.idGenerateur, this.editedGenerateur).subscribe(() => {
        this.loadGenerateurs();
        this.editingId = null;
        this.editedGenerateur = null;
      });
    }
  }

  cancelEdit() {
    this.editingId = null;
    this.editedGenerateur = null;
  }

  openDeleteModal(g: any) {
    this.generateurToDelete = g;
    if (!this.deleteModal) {
      const modalElement = document.getElementById('deleteGenerateurModal');
      if (modalElement) {
        this.deleteModal = new bootstrap.Modal(modalElement);
      }
    }
    if (this.deleteModal) {
      this.deleteModal.show();
    }
  }

  confirmDelete() {
    if (this.generateurToDelete) {
      this.generateurService.delete(this.generateurToDelete.idGenerateur).subscribe(() => {
        this.loadGenerateurs();
        this.deleteModal.hide();
        this.generateurToDelete = null;
      });
    }
  }

  cancelDelete() {
    if (this.deleteModal) {
      this.deleteModal.hide();
    }
    this.generateurToDelete = null;
  }

  openAddModal() {
    if (!this.addModal) {
      const addModalElement = document.getElementById('addGenerateurModal');
      if (addModalElement) {
        this.addModal = new bootstrap.Modal(addModalElement);
      }
    }
    if (this.addModal) {
      this.addModal.show();
    }
  }

  submitAddGenerateur() {
    this.generateurService.add(this.newGenerateur).subscribe(() => {
      this.loadGenerateurs();
      this.addModal.hide();
      this.newGenerateur = { nom: '', description: '', source: '', destination: '', format: '' };
    });
  }

  cancelAddGenerateurModal() {
    if (this.addModal) {
      this.addModal.hide();
    }
    this.newGenerateur = { nom: '', description: '', source: '', destination: '', format: '' };
  }
}
