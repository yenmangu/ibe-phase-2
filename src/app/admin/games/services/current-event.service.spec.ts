import { TestBed } from '@angular/core/testing';

import { CurrentEventService } from './current-event.service';

describe('CurrentEventService', () => {
  let service: CurrentEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrentEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
