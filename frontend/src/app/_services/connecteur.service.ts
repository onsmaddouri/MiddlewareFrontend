import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ConnecteurService {
  private baseUrl = 'http://localhost:8080/api/connecteurs';

  constructor(private http: HttpClient, private storageService: StorageService) {}

  private getAuthHeaders(): HttpHeaders {
    const user = this.storageService.getUser();
    const token = user?.accessToken;
    return token ? new HttpHeaders().set('Authorization', 'Bearer ' + token) : new HttpHeaders();
  }

  add(connecteur: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add`, connecteur, { headers: this.getAuthHeaders() });
  }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`, { headers: this.getAuthHeaders() });
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/delete/${id}`, { headers: this.getAuthHeaders() });
  }

  update(id: number, connecteur: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/update/${id}`, connecteur, { headers: this.getAuthHeaders() });
  }

  getCount(): Observable<number> {
    return this.http.get<number>('http://localhost:8080/api/connecteurs/count', { headers: this.getAuthHeaders() });
  }
} 