import { TestBed } from '@angular/core/testing';

import { ApiDataCoordinationService } from './api-data-coordination.service';

describe('ApiDataCoordinationService', () => {
  let service: ApiDataCoordinationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiDataCoordinationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
