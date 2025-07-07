import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ERPService {
  private apiUrl = 'http://localhost:8080/api/erps';

  constructor(private http: HttpClient) {}

  // Ajouter un ERP
  add(erp: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, erp);
  }

  // Récupérer tous les ERP
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  // Récupérer un ERP par ID
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Supprimer un ERP par ID
  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Mettre à jour un ERP
  update(id: number, erp: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, erp);
  }

  getCount(): Observable<number> {
    return this.http.get<number>('http://localhost:8080/api/erps/count');
  }
} 