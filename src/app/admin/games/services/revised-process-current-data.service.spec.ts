import { TestBed } from '@angular/core/testing';

import { RevisedProcessCurrentDataService } from './revised-process-current-data.service';

describe('RevisedProcessCurrentDataService', () => {
  let service: RevisedProcessCurrentDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RevisedProcessCurrentDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
