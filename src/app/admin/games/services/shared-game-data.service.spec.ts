import { TestBed } from '@angular/core/testing';

import { SharedGameDataService } from './shared-game-data.service';

describe('SharedGameDataService', () => {
  let service: SharedGameDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedGameDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
