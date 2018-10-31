import { TestBed } from '@angular/core/testing';

import { TrackingServiceService } from './tracking-service.service';

describe('TrackingServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TrackingServiceService = TestBed.get(TrackingServiceService);
    expect(service).toBeTruthy();
  });
});
