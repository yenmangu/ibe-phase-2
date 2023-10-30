import { TestBed } from '@angular/core/testing';

import { FetchCurrentDataService } from './fetch-current-data.service';

describe('FetchCurrentDataService', () => {
  let service: FetchCurrentDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchCurrentDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
