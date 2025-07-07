import { TestBed } from '@angular/core/testing';

import { GenerateurFluxService } from './generateur-flux.service';

describe('GenerateurFluxService', () => {
  let service: GenerateurFluxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerateurFluxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
