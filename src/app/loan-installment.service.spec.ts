import { TestBed } from '@angular/core/testing';

import { LoanInstallmentService } from './loan-installment.service';

describe('LoanInstallmentService', () => {
  let service: LoanInstallmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoanInstallmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
