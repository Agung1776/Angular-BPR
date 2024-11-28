import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LoanInfoService } from '../loan-info.service';
import { LoanInstallmentService } from '../loan-installment.service';
import { LoanInfo } from '../formcontoh/formcontoh.component';
import { LoanInstallment } from '../formcontoh/formcontoh.component';
import { TableModule } from '@coreui/angular';

@Component({
  selector: 'app-loan-detail',
  standalone: true,
  templateUrl: './loan-detail.component.html',
  imports:[CommonModule, TableModule],
  styleUrls: ['./loan-detail.component.css']
})
export class LoanDetailComponent implements OnInit {
  loanInfo: LoanInfo | undefined;
  loanInstallments: LoanInstallment[] = [];
  totalPrincipal: number = 0; 
  totalInterest: number = 0; 
  totalPaidInstallment: number = 0;

  constructor(
    private route: ActivatedRoute,
    private loanInfoService: LoanInfoService,
    private loanInstallmentService: LoanInstallmentService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchLoanInfo(Number(id)); // Convert id to number and fetch data
      this.fetchLoanInstallments(Number(id)); // Convert id to number and fetch data
    }
  }

  fetchLoanInfo(id: number): void {
    this.loanInfoService.getLoanInfoById(id).subscribe(
      (data) => {
        if (data) { 
          this.loanInfo = data;
        } else {
          console.error('Loan Info data is undefined');
        }
      },
      (error) => {
        console.error('Error fetching loan info', error);
      }
    );
  }

  fetchLoanInstallments(infoId: number): void {
    this.loanInstallmentService.getLoanInstallmentsByInfoId(infoId).subscribe(
      (data) => {
        if (data) { 
          this.loanInstallments = data;
          this.calculateTotals();
        } else {
          console.error('Loan Installments data is undefined');
        }
      },
      (error) => {
        console.error('Error fetching loan installments', error);
      }
    );
  }
  calculateTotals(): void { 
    this.totalPrincipal = this.loanInstallments.reduce((total, installment) => total + Number(installment.principal), 0); 
    this.totalInterest = this.loanInstallments.reduce((total, installment) => total + Number(installment.interest), 0); 
    this.totalPaidInstallment = this.loanInstallments.reduce((total, installment) => total + Number(installment.paid_instalment), 0); 
  }
  formatNumber(num: number): string { 
    return num.toLocaleString('id-ID'); 
  }
}
