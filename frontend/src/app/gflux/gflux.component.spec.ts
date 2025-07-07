import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GFluxComponent } from './gflux.component';

describe('GFluxComponent', () => {
  let component: GFluxComponent;
  let fixture: ComponentFixture<GFluxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GFluxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GFluxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
