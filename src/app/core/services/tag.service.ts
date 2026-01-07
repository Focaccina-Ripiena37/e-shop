import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tag } from '../models/tag';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TagService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  list(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.baseUrl}/tags`);
  }

  create(name: string): Observable<Tag> {
    return this.http.post<Tag>(`${this.baseUrl}/tags`, { name });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/tags/${id}`);
  }
}
