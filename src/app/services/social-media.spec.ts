import { TestBed } from '@angular/core/testing';

import { SocialMedia } from './social-media';

describe('SocialMedia', () => {
  let service: SocialMedia;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocialMedia);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
