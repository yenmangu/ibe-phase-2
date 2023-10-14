import { TestBed } from '@angular/core/testing';

import { ProcessCurrentDataService } from './process-current-data.service';

describe('ProcessCurrentDataService', () => {
  let service: ProcessCurrentDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessCurrentDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
