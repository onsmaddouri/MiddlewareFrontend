import { Component, OnInit } from '@angular/core';
import { ApplicationOpenSourceService } from '../_services/application-open-source.service';
declare var bootstrap: any;

@Component({
  selector: 'app-application-open-source',
  templateUrl: './application-open-source.component.html',
  styleUrls: ['./application-open-source.component.css']
})
export class ApplicationOpenSourceComponent implements OnInit {
  applications: any[] = [];
  filteredApplications: any[] = [];
  editingId: number | null = null;
  editedApplication: any = null;

  logoUrls: string[] = [];

  search = {
    nom: '',
    version: '',
    logoUrl: ''
  };

  applicationToDelete: any = null;
  deleteModal: any;

  newApplication: any = {
    nom: '',
    description: '',
    version: '',
    statut: ''
  };
  addModal: any;

  constructor(private appService: ApplicationOpenSourceService) {}

  ngOnInit(): void {
    this.loadApplications();
    const modalElement = document.getElementById('deleteAppModal');
    if (modalElement) {
      this.deleteModal = new bootstrap.Modal(modalElement);
    }
    const addModalElement = document.getElementById('addAppModal');
    if (addModalElement) {
      this.addModal = new bootstrap.Modal(addModalElement);
    }
  }

  loadApplications() {
    this.appService.getAll().subscribe(data => {
      this.applications = data;
      this.filteredApplications = data;
      this.logoUrls = Array.from(new Set(data.map(app => app.logoUrl).filter(url => !!url)));
    });
  }

  onSearch() {
    this.filteredApplications = this.applications.filter(app => {
      const matchNom = !this.search.nom || (app.nom && app.nom.toLowerCase().includes(this.search.nom.toLowerCase()));
      const matchVersion = !this.search.version || (app.version && app.version.toLowerCase().includes(this.search.version.toLowerCase()));
      const matchLogo = !this.search.logoUrl || (app.logoUrl === this.search.logoUrl);
      return matchNom && matchVersion && matchLogo;
    });
  }

  atLeastOneFilled(): boolean {
    return Object.values(this.search).some(val => val && val.trim() !== '');
  }

  startEditing(app: any) {
    this.editingId = app.id;
    this.editedApplication = { ...app };
  }

  saveEdit() {
    if (this.editedApplication) {
      this.appService.update(this.editedApplication.id, this.editedApplication).subscribe(() => {
        this.loadApplications();
        this.editingId = null;
        this.editedApplication = null;
      });
    }
  }

  cancelEdit() {
    this.editingId = null;
    this.editedApplication = null;
  }

  openDeleteModal(app: any) {
    this.applicationToDelete = app;
    if (!this.deleteModal) {
      const modalElement = document.getElementById('deleteAppModal');
      if (modalElement) {
        this.deleteModal = new bootstrap.Modal(modalElement);
      }
    }
    if (this.deleteModal) {
      this.deleteModal.show();
    }
  }

  confirmDelete() {
    if (this.applicationToDelete) {
      this.appService.delete(this.applicationToDelete.id).subscribe(() => {
        this.loadApplications();
        this.deleteModal.hide();
        this.applicationToDelete = null;
      });
    }
  }

  cancelDelete() {
    if (this.deleteModal) {
      this.deleteModal.hide();
    }
    this.applicationToDelete = null;
  }

  openAddModal() {
    if (!this.addModal) {
      const addModalElement = document.getElementById('addAppModal');
      if (addModalElement) {
        this.addModal = new bootstrap.Modal(addModalElement);
      }
    }
    if (this.addModal) {
      this.addModal.show();
    }
  }

  submitAddApplication() {
    this.appService.add(this.newApplication).subscribe(() => {
      this.loadApplications();
      this.addModal.hide();
      this.newApplication = { nom: '', description: '', version: '', statut: '' };
    });
  }

  cancelAddAppModal() {
    if (this.addModal) {
      this.addModal.hide();
    }
    this.newApplication = { nom: '', description: '', version: '', logoUrl: '' };
  }
}
