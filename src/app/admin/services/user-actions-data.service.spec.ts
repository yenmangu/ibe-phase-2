import { TestBed } from '@angular/core/testing';

import { UserActionsDataService } from './user-actions-data.service';

describe('UserActionsDataService', () => {
  let service: UserActionsDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserActionsDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
