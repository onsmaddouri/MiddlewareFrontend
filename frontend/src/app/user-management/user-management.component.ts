import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';

declare var bootstrap: any;

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  loading: boolean = false;
  editingId: number | null = null;

  search = {
    username: '',
    email: '',
    role: ''
  };

  // Variables pour les modals
  newUser: any = { username: '', email: '', password: '' };
  newUserRole: string = 'ROLE_USER';
  userToDelete: any = null;
  
  // Modals
  addModal: any;
  deleteModal: any;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
    // Initialiser les modals après un délai pour s'assurer que le DOM est prêt
    setTimeout(() => {
      this.initializeModals();
    }, 100);
  }

  initializeModals(): void {
    console.log('Initialisation des modals...');
    const addModalElement = document.getElementById('addUserModal');
    const deleteModalElement = document.getElementById('deleteUserModal');
    
    console.log('Éléments trouvés:', {
      addModal: !!addModalElement,
      deleteModal: !!deleteModalElement
    });

    if (addModalElement) {
      this.addModal = new bootstrap.Modal(addModalElement);
      console.log('Modal d\'ajout initialisé');
    }
    if (deleteModalElement) {
      this.deleteModal = new bootstrap.Modal(deleteModalElement);
      console.log('Modal de suppression initialisé');
    }
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: (data: any[]) => {
        this.users = data;
        this.filteredUsers = [...this.users];
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchUsername = !this.search.username || user.username.toLowerCase().includes(this.search.username.toLowerCase());
      const matchEmail = !this.search.email || user.email.toLowerCase().includes(this.search.email.toLowerCase());
      const matchRole = !this.search.role || this.getUserRole(user) === this.search.role;
      return matchUsername && matchEmail && matchRole;
    });
  }

  atLeastOneFilled(): boolean {
    return Object.values(this.search).some(val => val && val.trim() !== '');
  }

  resetFilters(): void {
    this.search = {
      username: '',
      email: '',
      role: ''
    };
    this.filteredUsers = this.users;
  }

  getUserRole(user: any): string {
    if (user.roles && user.roles.length > 0) {
      return user.roles[0].name;
    }
    return 'ROLE_USER';
  }

  // Méthodes pour l'édition inline (comme dans gflux)
  startEditing(id: number): void {
    this.editingId = id;
  }

  saveChanges(user: any): void {
    const updatedUser = {
      username: user.username,
      email: user.email,
      roles: [{ name: this.getUserRole(user) }]
    };

    this.userService.update(user.id, updatedUser).subscribe({
      next: (response) => {
        this.editingId = null;
        this.loadUsers();
        console.log('Utilisateur mis à jour avec succès');
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour:', error);
        alert('Erreur lors de la mise à jour de l\'utilisateur.');
      }
    });
  }

  // Méthodes pour les modals
  addUser(): void {
    console.log('addUser() appelé');
    this.newUser = { username: '', email: '', password: '' };
    this.newUserRole = 'ROLE_USER';
    if (this.addModal) {
      console.log('Ouverture du modal d\'ajout');
      this.addModal.show();
    } else {
      console.error('Modal d\'ajout non initialisé');
    }
  }

  openDeleteModal(user: any): void {
    console.log('openDeleteModal() appelé pour:', user);
    this.userToDelete = user;
    if (this.deleteModal) {
      console.log('Ouverture du modal de suppression');
      this.deleteModal.show();
    } else {
      console.error('Modal de suppression non initialisé');
    }
  }

  // Méthodes de sauvegarde
  saveNewUser(): void {
    // Vérifier si le nom d'utilisateur existe déjà
    const existingUser = this.users.find(u => u.username === this.newUser.username);
    if (existingUser) {
      alert('Ce nom d\'utilisateur existe déjà. Veuillez en choisir un autre.');
      return;
    }

    const userToCreate = {
      username: this.newUser.username,
      email: this.newUser.email,
      password: this.newUser.password,
      roles: [{ name: this.newUserRole }]
    };

    this.userService.create(userToCreate).subscribe({
      next: (response) => {
        this.addModal.hide();
        this.loadUsers();
        console.log('Utilisateur créé avec succès');
      },
      error: (error) => {
        console.error('Erreur lors de la création:', error);
        if (error.error && error.error.message && error.error.message.includes('Duplicate entry')) {
          alert('Ce nom d\'utilisateur existe déjà. Veuillez en choisir un autre.');
        } else {
          alert('Erreur lors de la création de l\'utilisateur.');
        }
      }
    });
  }

  confirmDelete(): void {
    if (!this.userToDelete) return;

    this.userService.delete(this.userToDelete.id).subscribe({
      next: (response) => {
        this.users = this.users.filter(u => u.id !== this.userToDelete.id);
        this.filteredUsers = this.filteredUsers.filter(u => u.id !== this.userToDelete.id);
        console.log('Utilisateur supprimé avec succès');
        this.deleteModal.hide();
        this.userToDelete = null;
      },
      error: (error) => {
        console.error('Erreur lors de la suppression:', error);
        this.deleteModal.hide();
        this.userToDelete = null;
      }
    });
  }

  cancelDelete(): void {
    this.deleteModal.hide();
    this.userToDelete = null;
  }

  // Méthodes de fermeture des modals
  closeAddModal(): void {
    if (this.addModal) {
      this.addModal.hide();
    }
  }
}