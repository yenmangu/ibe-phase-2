import { TestBed } from '@angular/core/testing';

import { CurrentGamesDatabaseService } from './current-games-database.service';

describe('CurrentGamesDatabaseService', () => {
  let service: CurrentGamesDatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrentGamesDatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
