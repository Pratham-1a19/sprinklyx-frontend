import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LargeFileUploader } from './large-file-uploader';

describe('LargeFileUploader', () => {
  let component: LargeFileUploader;
  let fixture: ComponentFixture<LargeFileUploader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LargeFileUploader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LargeFileUploader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
