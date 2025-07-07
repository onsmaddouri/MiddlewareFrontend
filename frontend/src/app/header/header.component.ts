import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../_services/storage.service';
import { AuthService } from '../_services/auth.service';
import { EventBusService } from '../_shared/event-bus.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showUserBoard = false;
  username?: string;

  eventBusSub?: Subscription;

  constructor(
    private router: Router,
    private storageService: StorageService,
    private authService: AuthService,
    private eventBusService: EventBusService
  ) {}

  ngOnInit(): void {
    this.updateLoginState();

    this.eventBusSub = this.eventBusService.on('logout', () => {
      this.logout();
    });

    this.eventBusService.on('login', () => {
      this.updateLoginState();
    });
  }

  ngOnDestroy(): void {
    if (this.eventBusSub) {
      this.eventBusSub.unsubscribe();
    }
  }

  updateLoginState(): void {
    this.isLoggedIn = this.storageService.isLoggedIn();
    this.roles = [];
    this.showAdminBoard = false;
    this.showUserBoard = false;
    this.username = undefined;

    if (this.isLoggedIn) {
      const user = this.storageService.getUser();
      this.roles = user.roles;
      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showUserBoard = this.roles.includes('ROLE_USER');
      this.username = user.username;
    }
  }

  logout(): void {
    this.authService.logout();
    this.updateLoginState();
    this.router.navigate(['/home']);
  }
}
