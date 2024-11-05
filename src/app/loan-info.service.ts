import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoanInfo } from './formcontoh/formcontoh.component';

@Injectable({
  providedIn: 'root'
})
export class LoanInfoService {
  private apiUrl = 'http://203.100.57.66:8180/api/loan/info';

  constructor(private http: HttpClient) { }

  createLoanInfo(loanInfo: LoanInfo): Observable<LoanInfo> {
    return this.http.post<LoanInfo>(this.apiUrl, loanInfo);
  }
}
