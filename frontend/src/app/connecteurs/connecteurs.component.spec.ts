import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnecteursComponent } from './connecteurs.component';

describe('ConnecteursComponent', () => {
  let component: ConnecteursComponent;
  let fixture: ComponentFixture<ConnecteursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnecteursComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnecteursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
