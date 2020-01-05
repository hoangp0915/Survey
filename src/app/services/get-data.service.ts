import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetDataService {
  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    const url = `assets/data/data.json`;
    return this.http.get(url);
  }
  getDataByCode(): Observable<any> {
    const url = `assets/data/datasurvey.json`;
    return this.http.get(url);
  }
  createSurvey(body): Observable<any> {
    const url = `assets/data/data.json`;
    return this.http.post(url,body);
  }
}
