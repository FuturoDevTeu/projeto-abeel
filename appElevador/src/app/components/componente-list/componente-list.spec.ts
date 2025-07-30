import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponenteList } from './componente-list';

describe('ComponenteList', () => {
  let component: ComponenteList;
  let fixture: ComponentFixture<ComponenteList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponenteList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponenteList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
