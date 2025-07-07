import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class GenerateurFluxService {
  private baseUrl = 'http://localhost:8080/api/generateurs';

  constructor(private http: HttpClient, private storageService: StorageService) {}

  private getAuthHeaders(): HttpHeaders {
    const user = this.storageService.getUser();
    const token = user?.accessToken;
    return token ? new HttpHeaders().set('Authorization', 'Bearer ' + token) : new HttpHeaders();
  }

  // Ajouter un générateur de flux
  add(generateur: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add`, generateur, { headers: this.getAuthHeaders() });
  }

  // Récupérer tous les générateurs de flux
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`, { headers: this.getAuthHeaders() });
  }

  // Récupérer un générateur de flux par ID
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // Supprimer un générateur de flux par ID
  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/delete/${id}`, { headers: this.getAuthHeaders() });
  }

  // Mettre à jour un générateur de flux
  update(id: number, generateur: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/update/${id}`, generateur, { headers: this.getAuthHeaders() });
  }

  // Obtenir le nombre total de générateurs de flux
  getCount(): Observable<number> {
    return this.http.get<number>('http://localhost:8080/api/generateurs/count', { headers: this.getAuthHeaders() });
  }
} 