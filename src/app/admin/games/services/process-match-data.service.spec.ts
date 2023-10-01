import { TestBed } from '@angular/core/testing';

import { ProcessMatchDataService } from './process-match-data.service';

describe('ProcessMatchDataService', () => {
  let service: ProcessMatchDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessMatchDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
