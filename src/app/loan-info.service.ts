import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoanInfo } from './formcontoh/formcontoh.component';

@Injectable({
  providedIn: 'root'
})
export class LoanInfoService {
  private apiUrl = '/api/loan/info';

  constructor(private http: HttpClient) { }

  createLoanInfo(loanInfo: LoanInfo): Observable<LoanInfo> {
    return this.http.post<LoanInfo>(this.apiUrl, loanInfo);
  }
  getLoanInfoById(id: number): Observable<LoanInfo> { 
    return this.http.get<LoanInfo>(`${this.apiUrl}/${id}`); 
  }
  getAllLoanInfos(): Observable<LoanInfo[]> { 
    return this.http.get<LoanInfo[]>(this.apiUrl); 
  }
}
