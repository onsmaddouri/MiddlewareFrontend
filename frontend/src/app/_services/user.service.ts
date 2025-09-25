import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080/api/test/';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getPublicContent(): Observable<any> {
    return this.http.get(API_URL + 'all', { responseType: 'text' });
  }

  getUserBoard(): Observable<any> {
    return this.http.get(API_URL + 'user', { responseType: 'text' });
  }
  
  getModeratorBoard(): Observable<any> {
    return this.http.get(API_URL + 'mod', { responseType: 'text' });
  }

  getAdminBoard(): Observable<any> {
    return this.http.get(API_URL + 'admin', { responseType: 'text' });
  }

  getCount(): Observable<number> {
    return this.http.get<number>('http://localhost:8080/api/users/count');
  }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/api/users');
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`http://localhost:8080/api/users/${id}`);
  }

  create(user: any): Observable<any> {
    return this.http.post<any>('http://localhost:8080/api/users', user);
  }

  update(id: number, user: any): Observable<any> {
    return this.http.put<any>(`http://localhost:8080/api/users/${id}`, user);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`http://localhost:8080/api/users/${id}`);
  }
}
