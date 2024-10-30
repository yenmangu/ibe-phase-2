import { TestBed } from '@angular/core/testing';

import { UserActionsTableControlService } from './user-actions-table-control.service';

describe('UserActionsTableControlService', () => {
  let service: UserActionsTableControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserActionsTableControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
