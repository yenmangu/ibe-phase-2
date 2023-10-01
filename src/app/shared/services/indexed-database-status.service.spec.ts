import { TestBed } from '@angular/core/testing';

import { IndexedDatabaseStatusService } from './indexed-database-status.service';

describe('IndexedDatabaseStatusService', () => {
  let service: IndexedDatabaseStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndexedDatabaseStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
