import { TestBed } from '@angular/core/testing';

import { UserActionsHttpService } from './user-actions-http.service';

describe('UserActionsHttpService', () => {
  let service: UserActionsHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserActionsHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
