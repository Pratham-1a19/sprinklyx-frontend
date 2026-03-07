import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectAccounts } from './connect-accounts';

describe('ConnectAccounts', () => {
  let component: ConnectAccounts;
  let fixture: ComponentFixture<ConnectAccounts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectAccounts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectAccounts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
