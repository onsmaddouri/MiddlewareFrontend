import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicationOpenSourceModuleService {
  private apiUrl = 'http://localhost:8080/api/modules-apps';

  constructor(private http: HttpClient) {}

  // Ajouter un module d'application open source
  add(module: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, module);
  }

  // Récupérer tous les modules
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  // Récupérer un module par ID
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Supprimer un module par ID
  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`);
  }

  // Mettre à jour un module
  update(id: number, module: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${id}`, module);
  }

  // Obtenir le nombre de modules
  getCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }

  // Obtenir les modules par application
  getByApplication(applicationId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/by-application/${applicationId}`);
  }
}
