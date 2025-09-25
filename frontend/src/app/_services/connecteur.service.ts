import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnecteurService {
  private apiUrl = 'http://localhost:8080/api/connecteurs';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  add(connecteur: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, connecteur);
  }

  update(id: number, connecteur: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, connecteur);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`);
  }

  getCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }
}
