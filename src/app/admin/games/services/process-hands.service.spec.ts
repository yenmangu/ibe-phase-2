import { TestBed } from '@angular/core/testing';

import { ProcessHandsService } from './process-hands.service';

describe('ProcessHandsService', () => {
  let service: ProcessHandsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessHandsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
