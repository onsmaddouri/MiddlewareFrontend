import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicationOpenSourceService {
  private apiUrl = 'http://localhost:8080/api/applications';

  constructor(private http: HttpClient) {}

  add(app: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, app);
  }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`);
  }

  update(id: number, app: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${id}`, app);
  }

  getCount(): Observable<number> {
    return this.http.get<number>('http://localhost:8080/api/applications/count');
  }
} 