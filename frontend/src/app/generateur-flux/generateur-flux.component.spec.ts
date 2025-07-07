import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateurFluxComponent } from './generateur-flux.component';

describe('GenerateurFluxComponent', () => {
  let component: GenerateurFluxComponent;
  let fixture: ComponentFixture<GenerateurFluxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateurFluxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateurFluxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
