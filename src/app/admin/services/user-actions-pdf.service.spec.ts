import { TestBed } from '@angular/core/testing';

import { UserActionsPdfService } from './user-actions-pdf.service';

describe('UserActionsPdfService', () => {
  let service: UserActionsPdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserActionsPdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
