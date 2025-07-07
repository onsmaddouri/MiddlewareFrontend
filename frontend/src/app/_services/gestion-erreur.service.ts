import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GestionErreurService {

  constructor(private http: HttpClient) { }

  getCountNonResolu(): Observable<number> {
    return this.http.get<number>('http://localhost:8080/api/erreurs/countNonResolu');
  }
} 