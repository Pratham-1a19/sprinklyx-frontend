import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialMediaPosting } from './social-media-posting';

describe('SocialMediaPosting', () => {
  let component: SocialMediaPosting;
  let fixture: ComponentFixture<SocialMediaPosting>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialMediaPosting]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocialMediaPosting);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
