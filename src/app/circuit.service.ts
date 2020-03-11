import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CircuitService {

  private uri: string;
  private headers: HttpHeaders = new HttpHeaders();

  constructor(
    public httpClient: HttpClient
  ) {
    this.uri = 'https://rx7keuhjck.execute-api.us-east-1.amazonaws.com/staging/circuits';
    this.headers.append('Access-Control-Allow-Origin' , '*');
    this.headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    this.headers.append('Accept', 'application/json');
    this.headers.append('content-type', 'application/json');
  }

  create(data: any): Observable<any> {
    return this.httpClient.post(this.uri, data, { headers: this.headers });
  }
}
