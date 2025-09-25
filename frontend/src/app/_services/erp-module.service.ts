import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ERPModuleService {
  private apiUrl = `${environment.apiUrl}/api/modules-erp`;

  constructor(private http: HttpClient) {}

  // Ajouter un module ERP
  add(module: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, module);
  }

  // Récupérer tous les modules ERP
  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  // Récupérer un module ERP par ID
  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Supprimer un module ERP par ID
  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`);
  }

  // Mettre à jour un module ERP
  update(id: number, module: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${id}`, module);
  }

  // Obtenir le nombre de modules ERP
  getCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }

  // Obtenir les modules par ERP
  getByERP(erpId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/by-erp/${erpId}`);
  }
}
