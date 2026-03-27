import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostScheduling } from './post-scheduling';

describe('PostScheduling', () => {
  let component: PostScheduling;
  let fixture: ComponentFixture<PostScheduling>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostScheduling]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostScheduling);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
