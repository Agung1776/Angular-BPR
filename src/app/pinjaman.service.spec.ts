import { TestBed } from '@angular/core/testing';

import { PinjamanService } from './pinjaman.service';

describe('PinjamanService', () => {
  let service: PinjamanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PinjamanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
