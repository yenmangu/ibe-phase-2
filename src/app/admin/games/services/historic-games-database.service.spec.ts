import { TestBed } from '@angular/core/testing';

import { HistoricGamesDatabaseService } from './historic-games-database.service';

describe('HistoricGamesDatabaseService', () => {
  let service: HistoricGamesDatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoricGamesDatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
