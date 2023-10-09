import { TestBed } from '@angular/core/testing';

import { ProcessCurrentMatchService } from './process-current-match.service';

describe('ProcessCurrentMatchService', () => {
  let service: ProcessCurrentMatchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessCurrentMatchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
