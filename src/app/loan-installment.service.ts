import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoanInstallment } from './formcontoh/formcontoh.component';
@Injectable({
  providedIn: 'root'
})
export class LoanInstallmentService {
  private apiUrl = '/api/loan/installment'; 

  constructor(private http: HttpClient) {}

  // Method to fetch all loan installments
  getLoanInstallments(): Observable<LoanInstallment[]> {
    return this.http.get<LoanInstallment[]>(this.apiUrl);
  }

  // Method to insert a new loan installment
  createLoanInstallment(loanInstallment: LoanInstallment): Observable<LoanInstallment> {
    return this.http.post<LoanInstallment>(this.apiUrl, loanInstallment);
  }
  getLoanInstallmentsByInfoId(infoId: number): Observable<LoanInstallment[]> { 
    return this.http.get<LoanInstallment[]>(`${this.apiUrl}?info_id=${infoId}`); 
  }
}
