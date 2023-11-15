import { TestBed } from '@angular/core/testing';

import { HandActionsHttpService } from './hand-actions-http.service';

describe('HandActionsHttpService', () => {
  let service: HandActionsHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HandActionsHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
