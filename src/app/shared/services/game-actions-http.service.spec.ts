import { TestBed } from '@angular/core/testing';

import { GameActionsHttpService } from './game-actions-http.service';

describe('GameActionsHttpService', () => {
  let service: GameActionsHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameActionsHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
