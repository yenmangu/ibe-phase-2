import { TestBed } from '@angular/core/testing';

import { CurrentGamesDatabaseServiceService } from './current-games-database-service.service';

describe('CurrentGamesDatabaseServiceService', () => {
  let service: CurrentGamesDatabaseServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrentGamesDatabaseServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
