import { Component, OnInit } from '@angular/core';
import { LoanInfoService } from '../loan-info.service';
import { LoanInstallmentService } from '../loan-installment.service';
import { LoanInfo } from '../formcontoh/formcontoh.component';
import { TableModule, ButtonModule } from '@coreui/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TableModule, CommonModule, ButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {
  loanInfos: LoanInfo[] = [];
  sortColumn: string = '';
  sortAscending: boolean = true
  constructor(
    private router: Router,
    private loanInfoService: LoanInfoService,
  ) {}

  ngOnInit(): void {
    this.fetchLoanInfos();
  }

  fetchLoanInfos(): void {
    this.loanInfoService.getAllLoanInfos().subscribe(
      (data) => {
        this.loanInfos = data;
        console.log('LoanInfos fetched successfully', this.loanInfos);
      },
      (error) => {
        console.error('Error fetching LoanInfos', error);
      }
    );
  }

  goToLoanDetail(id: number | undefined): void {
    if (id !== undefined) { 
      this.router.navigate(['/loan-detail', id]); 
    } else {
       console.error('Loan ID is undefined'); 
      } 
    }
  
    sortBy(column: string): void {
      if (this.sortColumn === column) {
        this.sortAscending = !this.sortAscending;
      } else {
        this.sortColumn = column;
        this.sortAscending = true;
      }
      
      this.loanInfos.sort((a, b) => {
        let valueA = a[column as keyof LoanInfo];
        let valueB = b[column as keyof LoanInfo];
        
        // Handle undefined or null values
        if (valueA === undefined || valueA === null) valueA = '';
        if (valueB === undefined || valueB === null) valueB = '';
        
        // Handle numbers correctly
        if (typeof valueA === 'number' && typeof valueB === 'number') {
          return this.sortAscending ? valueA - valueB : valueB - valueA;
        }
    
        // Handle strings (case insensitive)
        valueA = valueA.toString().toLowerCase();
        valueB = valueB.toString().toLowerCase();
        let comparison = 0;
    
        if (valueA > valueB) {
          comparison = 1;
        } else if (valueA < valueB) {
          comparison = -1;
        }
    
        return this.sortAscending ? comparison : -comparison;
      });
    }
    

}

