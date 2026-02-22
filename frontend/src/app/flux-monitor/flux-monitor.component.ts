import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../_services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-flux-monitor',
  templateUrl: './flux-monitor.component.html',
  styleUrls: ['./flux-monitor.component.css']
})
export class FluxMonitorComponent implements OnInit {
  
  notifications: any[] = [];
  
  loading = {
    notifications: false
  };

  constructor(
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  // ==================== CHARGEMENT DES NOTIFICATIONS ====================

  loadNotifications() {
    this.loading.notifications = true;
    this.notificationService.getUnreadNotifications().subscribe({
      next: (data) => {
        this.notifications = data;
        this.loading.notifications = false;
        console.log('Notifications chargées:', this.notifications);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des notifications:', err);
        this.loading.notifications = false;
      }
    });
  }

  // ==================== GESTION DES NOTIFICATIONS ====================

  markNotificationAsRead(notificationId: number) {
    this.notificationService.markAsRead(notificationId).subscribe({
      next: () => {
        // Retirer la notification de la liste
        this.notifications = this.notifications.filter(n => n.id !== notificationId);
        console.log('Notification marquée comme lue');
      },
      error: (err) => {
        console.error('Erreur lors du marquage:', err);
      }
    });
  }

  markAllNotificationsAsRead() {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications = [];
        console.log('Toutes les notifications marquées comme lues');
      },
      error: (err) => {
        console.error('Erreur lors du marquage global:', err);
      }
    });
  }

  // ==================== UTILITAIRES ====================

  getNotificationIconColor(type: string): string {
    switch (type) {
      case 'SUCCESS': return '#28a745';
      case 'ERROR': return '#dc3545';
      case 'WARNING': return '#ffc107';
      case 'INFO': return '#17a2b8';
      default: return '#6c757d';
    }
  }
}