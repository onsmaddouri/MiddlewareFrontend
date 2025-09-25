import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private baseUrl = 'http://localhost:8080/api/logs';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/all`);
  }

  getByLevel(level: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/level/${level}`);
  }

  getBySource(source: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/source/${source}`);
  }

  getByDateRange(startDate: string, endDate: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/date-range?start=${startDate}&end=${endDate}`);
  }

  getCount(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/count`);
  }
}