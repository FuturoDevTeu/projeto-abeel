import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElevadoresList } from './elevadores-list';

describe('ElevadoresList', () => {
  let component: ElevadoresList;
  let fixture: ComponentFixture<ElevadoresList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElevadoresList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElevadoresList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
