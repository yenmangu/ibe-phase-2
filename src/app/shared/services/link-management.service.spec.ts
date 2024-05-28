import { TestBed } from '@angular/core/testing';

import { LinkManagementService } from './link-management.service';

describe('LinkManagementService', () => {
  let service: LinkManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LinkManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
