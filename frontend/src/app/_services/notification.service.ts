import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private baseUrl = 'http://localhost:8080/api/flux';

  constructor(private http: HttpClient) {}

  /**
   * Récupérer les notifications pour un flux
   */
  getFluxNotifications(fluxId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${fluxId}/notifications`);
  }

  /**
   * Marquer une notification comme lue
   */
  markAsRead(notificationId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/notifications/${notificationId}/read`, {});
  }

  /**
   * Récupérer toutes les notifications non lues
   */
  getUnreadNotifications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/notifications/unread`);
  }

  /**
   * Marquer toutes les notifications comme lues
   */
  markAllAsRead(): Observable<any> {
    return this.http.put(`${this.baseUrl}/notifications/mark-all-read`, {});
  }
}
