import { TestBed } from '@angular/core/testing';

import { ApiDataProcessingService } from './api-data-processing.service';

describe('ApiDataProcessingService', () => {
  let service: ApiDataProcessingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiDataProcessingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
