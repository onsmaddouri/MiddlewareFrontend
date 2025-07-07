import { Component, OnInit } from '@angular/core';
import { ERPService } from '../_services/erp.service';
declare var bootstrap: any;

@Component({
  selector: 'app-erp',
  templateUrl: './erp.component.html',
  styleUrls: ['./erp.component.css']
})
export class ERPComponent implements OnInit {
  erps: any[] = [];
  filteredErps: any[] = [];
  editingId: number | null = null;
  editedErp: any = null;

  logoUrls: string[] = [];
  search = {
    nom: '',
    version: '',
    logoUrl: ''
  };

  erpToDelete: any = null;
  deleteModal: any;

  newErp: any = {
    nom: '',
    description: '',
    version: '',
    logoUrl: ''
  };
  addModal: any;

  constructor(private erpService: ERPService) {}

  ngOnInit(): void {
    this.loadErps();
    const modalElement = document.getElementById('deleteErpModal');
    if (modalElement) {
      this.deleteModal = new bootstrap.Modal(modalElement);
    }
    const addModalElement = document.getElementById('addErpModal');
    if (addModalElement) {
      this.addModal = new bootstrap.Modal(addModalElement);
    }
  }

  loadErps() {
    this.erpService.getAll().subscribe(data => {
      this.erps = data;
      this.filteredErps = data;
      this.logoUrls = Array.from(new Set(data.map(erp => erp.logoUrl).filter(url => !!url)));
    });
  }

  onSearch() {
    this.filteredErps = this.erps.filter(erp => {
      const matchNom = !this.search.nom || (erp.nom && erp.nom.toLowerCase().includes(this.search.nom.toLowerCase()));
      const matchVersion = !this.search.version || (erp.version && erp.version.toLowerCase().includes(this.search.version.toLowerCase()));
      const matchLogo = !this.search.logoUrl || (erp.logoUrl === this.search.logoUrl);
      return matchNom && matchVersion && matchLogo;
    });
  }

  atLeastOneFilled(): boolean {
    return Object.values(this.search).some(val => val && val.trim() !== '');
  }

  startEditing(erp: any) {
    this.editingId = erp.id;
    this.editedErp = { ...erp };
  }

  saveEdit() {
    if (this.editedErp) {
      this.erpService.update(this.editedErp.id, this.editedErp).subscribe(() => {
        this.loadErps();
        this.editingId = null;
        this.editedErp = null;
      });
    }
  }

  cancelEdit() {
    this.editingId = null;
    this.editedErp = null;
  }

  openDeleteModal(erp: any) {
    this.erpToDelete = erp;
    if (!this.deleteModal) {
      const modalElement = document.getElementById('deleteErpModal');
      if (modalElement) {
        this.deleteModal = new bootstrap.Modal(modalElement);
      }
    }
    if (this.deleteModal) {
      this.deleteModal.show();
    }
  }

  confirmDelete() {
    if (this.erpToDelete) {
      this.erpService.delete(this.erpToDelete.id).subscribe(() => {
        this.loadErps();
        this.deleteModal.hide();
        this.erpToDelete = null;
      });
    }
  }

  cancelDelete() {
    if (this.deleteModal) {
      this.deleteModal.hide();
    }
    this.erpToDelete = null;
  }

  openAddModal() {
    if (!this.addModal) {
      const addModalElement = document.getElementById('addErpModal');
      if (addModalElement) {
        this.addModal = new bootstrap.Modal(addModalElement);
      }
    }
    if (this.addModal) {
      this.addModal.show();
    }
  }

  submitAddErp() {
    this.erpService.add(this.newErp).subscribe(() => {
      this.loadErps();
      this.addModal.hide();
      this.newErp = { nom: '', description: '', version: '', logoUrl: '' };
    });
  }

  cancelAddErpModal() {
    if (this.addModal) {
      this.addModal.hide();
    }
    this.newErp = { nom: '', description: '', version: '', logoUrl: '' };
  }
}
