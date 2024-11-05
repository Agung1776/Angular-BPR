import { TestBed } from '@angular/core/testing';

import { LoanInfoService } from './loan-info.service';

describe('LoanInfoService', () => {
  let service: LoanInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoanInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
