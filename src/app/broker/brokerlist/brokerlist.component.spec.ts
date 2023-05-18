import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerlistComponent } from './brokerlist.component';

describe('BrokerlistComponent', () => {
  let component: BrokerlistComponent;
  let fixture: ComponentFixture<BrokerlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrokerlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrokerlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
