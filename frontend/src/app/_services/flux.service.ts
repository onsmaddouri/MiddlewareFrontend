import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class FluxService {
  private baseUrl = 'http://localhost:8080/api/flux';

  constructor(private http: HttpClient, private storageService: StorageService) {}

  private getAuthHeaders(): HttpHeaders {
    const user = this.storageService.getUser();
    const token = user?.accessToken;
    return token ? new HttpHeaders().set('Authorization', 'Bearer ' + token) : new HttpHeaders();
  }

  getAllFlux(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`, { headers: this.getAuthHeaders() });
  }

  createFlux(flux: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/addflux`, flux, { headers: this.getAuthHeaders() });
  }

  updateFlux(id: number, fluxDetails: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, fluxDetails, { headers: this.getAuthHeaders() });
  }

  deleteFlux(fluxId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${fluxId}`, {
      headers: this.getAuthHeaders()
    });
  }
  
  archiveFlux(fluxId: number, adminName: string): Observable<any> {
    const params = new HttpParams().set('adminName', adminName);
    return this.http.put(`${this.baseUrl}/${fluxId}/archive`, {}, { params, headers: this.getAuthHeaders() });
  }

  validateFlux(fluxId: number, adminName: string): Observable<any> {
    const params = new HttpParams().set('adminName', adminName);
    return this.http.put(`${this.baseUrl}/${fluxId}/validate`, {}, { params, headers: this.getAuthHeaders() });
  }

  cancelFlux(fluxId: number, adminName: string): Observable<any> {
    const params = new HttpParams().set('adminName', adminName);
    return this.http.put(`${this.baseUrl}/${fluxId}/cancel`, {}, { params, headers: this.getAuthHeaders() });
  }

  startFlux(fluxId: number, adminName: string): Observable<any> {
    const params = new HttpParams().set('adminName', adminName);
    return this.http.put(`${this.baseUrl}/${fluxId}/start`, {}, { params, headers: this.getAuthHeaders() });
  }

  unarchiveFlux(fluxId: number, adminName: string): Observable<any> {
    const params = new HttpParams().set('adminName', adminName);
    return this.http.put(`${this.baseUrl}/${fluxId}/unarchive`, {}, { params, headers: this.getAuthHeaders() });
  }

  unvalidateFlux(fluxId: number, adminName: string): Observable<any> {
    const params = new HttpParams().set('adminName', adminName);
    return this.http.put(`${this.baseUrl}/${fluxId}/unvalidate`, {}, { params, headers: this.getAuthHeaders() });
  }

  uncancelFlux(fluxId: number, adminName: string): Observable<any> {
    const params = new HttpParams().set('adminName', adminName);
    return this.http.put(`${this.baseUrl}/${fluxId}/uncancel`, {}, { params, headers: this.getAuthHeaders() });
  }

  getCount(): Observable<number> {
    return this.http.get<number>('http://localhost:8080/api/flux/count');
  }
} 