import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class FluxService {
  private baseUrl = 'http://localhost:8080/api/flux';
  private monitorUrl = 'http://localhost:8080/api/flux-monitor';

  constructor(private http: HttpClient, private storageService: StorageService) {}

  private getAuthHeaders(): HttpHeaders {
    const user = this.storageService.getUser();
    const token = user?.accessToken;
    return token ? new HttpHeaders().set('Authorization', 'Bearer ' + token) : new HttpHeaders();
  }

  // ==================== MÉTHODES CRUD EXISTANTES ====================
  
  getAllFlux(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`);
  }

  /**
   * Recherche AJAX de flux avec critères multiples
   */
  searchFlux(nomFlux?: string, statut?: string, dateCreation?: string, source?: string, destination?: string): Observable<any[]> {
    let params = new HttpParams();
    
    if (nomFlux) params = params.set('nomFlux', nomFlux);
    if (statut) params = params.set('statut', statut);
    if (dateCreation) params = params.set('dateCreation', dateCreation);
    if (source) params = params.set('source', source);
    if (destination) params = params.set('destination', destination);
    
    return this.http.get<any[]>(`${this.baseUrl}/search`, { params });
  }

  createFlux(flux: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/addflux`, flux);
  }

  updateFlux(id: number, fluxDetails: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, fluxDetails);
  }
  
  deleteFlux(fluxId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${fluxId}`);
  }

  getCount(): Observable<number> {
    return this.http.get<number>('http://localhost:8080/api/flux/count');
  }

  // ==================== GESTION DES STATUTS ====================
  
  archiveFlux(fluxId: number, adminName: string): Observable<any> {
    const params = new HttpParams().set('adminName', adminName);
    return this.http.put(`${this.baseUrl}/${fluxId}/archive`, {}, { params });
  }

  validateFlux(fluxId: number, adminName: string): Observable<any> {
    const params = new HttpParams().set('adminName', adminName);
    return this.http.put(`${this.baseUrl}/${fluxId}/validate`, {}, { params });
  }

  cancelFlux(fluxId: number, adminName: string): Observable<any> {
    const params = new HttpParams().set('adminName', adminName);
    return this.http.put(`${this.baseUrl}/${fluxId}/cancel`, {}, { params });
  }

  startFlux(fluxId: number, adminName: string): Observable<any> {
    const params = new HttpParams().set('adminName', adminName);
    return this.http.put(`${this.baseUrl}/${fluxId}/start`, {}, { params });
  }

  // ==================== ACTIONS ADMIN ====================
  
  unarchiveFlux(fluxId: number, adminName: string): Observable<any> {
    const params = new HttpParams().set('adminName', adminName);
    return this.http.put(`${this.baseUrl}/${fluxId}/unarchive`, {}, { params });
  }
  
  unvalidateFlux(fluxId: number, adminName: string): Observable<any> {
    const params = new HttpParams().set('adminName', adminName);
    return this.http.put(`${this.baseUrl}/${fluxId}/unvalidate`, {}, { params });
  }
  
  uncancelFlux(fluxId: number, adminName: string): Observable<any> {
    const params = new HttpParams().set('adminName', adminName);
    return this.http.put(`${this.baseUrl}/${fluxId}/uncancel`, {}, { params });
  }

  // ==================== NOUVELLES FONCTIONNALITÉS ====================

  /**
   * Statut détaillé d'un flux
   */
  getFluxStatus(fluxId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${fluxId}/status`);
  }

  /**
   * Liste des flux par statut
   */
  getFluxByStatus(status: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/by-status/${status}`);
  }

  /**
   * Flux en cours d'exécution
   */
  getRunningFlux(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/running`);
  }

  /**
   * Flux validés non archivés
   */
  getValidatedFlux(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/validated`);
  }

  /**
   * Statistiques des flux
   */
  getFluxStatistics(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/statistics`);
  }

  /**
   * Exécution manuelle d'un flux
   */
  executeFlux(fluxId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${fluxId}/execute`, {});
  }

  /**
   * Test des connexions d'un flux
   */
  testFluxConnection(fluxId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${fluxId}/test-connection`, {});
  }

  // ==================== NOTIFICATIONS ====================

  /**
   * Récupérer les notifications pour un flux
   */
  getFluxNotifications(fluxId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${fluxId}/notifications`);
  }

  /**
   * Marquer une notification comme lue
   */
  markNotificationAsRead(notificationId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/notifications/${notificationId}/read`, {});
  }

  /**
   * Récupérer toutes les notifications non lues
   */
  getUnreadNotifications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/notifications/unread`);
  }

  // ==================== MONITORING ====================

  /**
   * Dashboard principal avec statistiques temps réel
   */
  getDashboard(): Observable<any> {
    return this.http.get<any>(`${this.monitorUrl}/dashboard`);
  }

  /**
   * Historique détaillé d'un flux
   */
  getFluxHistory(fluxId: number): Observable<any> {
    return this.http.get<any>(`${this.monitorUrl}/flux/${fluxId}/history`);
  }

  /**
   * Surveillance en temps réel des flux en cours
   */
  getRealTimeStatus(): Observable<any[]> {
    return this.http.get<any[]>(`${this.monitorUrl}/real-time-status`);
  }

  /**
   * Actions en lot sur plusieurs flux
   */
  executeBatchAction(action: string, fluxIds: number[], adminName: string): Observable<any> {
    const params = new HttpParams()
      .set('action', action)
      .set('fluxIds', fluxIds.join(','))
      .set('adminName', adminName);
    return this.http.post(`${this.monitorUrl}/batch-action`, {}, { params });
  }

  /**
   * Nettoyage des données anciennes
   */
  cleanupOldData(): Observable<any> {
    return this.http.post(`${this.monitorUrl}/cleanup`, {});
  }

  /**
   * Rapport d'activité détaillé
   */
  getActivityReport(period?: string): Observable<any> {
    const params = period ? new HttpParams().set('period', period) : new HttpParams();
    return this.http.get<any>(`${this.monitorUrl}/activity-report`, { params });
  }

  /**
   * Health check du système
   */
  getSystemHealth(): Observable<any> {
    return this.http.get<any>(`${this.monitorUrl}/health`);
  }
}
