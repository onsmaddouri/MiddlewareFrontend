import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenerateurFluxService {
  private apiUrl = 'http://localhost:8080/api/generateurs';

  constructor(private http: HttpClient) {}

  // Ajouter un générateur de flux
  add(generateur: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, generateur);
  }

  // Récupérer tous les générateurs de flux
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  // Récupérer un générateur de flux par ID
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Supprimer un générateur de flux par ID
  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`);
  }

  // Mettre à jour un générateur de flux
  update(id: number, generateur: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, generateur);
  }

  getCount(): Observable<number> {
    return this.http.get<number>('http://localhost:8080/api/generateurs/count');
  }
}
