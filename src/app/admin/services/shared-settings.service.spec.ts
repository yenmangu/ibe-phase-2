import { TestBed } from '@angular/core/testing';

import { SharedSettingsService } from './shared-settings.service';

describe('SharedSettingsService', () => {
  let service: SharedSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
