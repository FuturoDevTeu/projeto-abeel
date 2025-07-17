import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrediosList } from './predios-list';

describe('PrediosList', () => {
  let component: PrediosList;
  let fixture: ComponentFixture<PrediosList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrediosList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrediosList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
