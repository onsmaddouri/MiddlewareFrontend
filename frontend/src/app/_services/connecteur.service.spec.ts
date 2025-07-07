import { TestBed } from '@angular/core/testing';

import { ConnecteurService } from './connecteur.service';

describe('ConnecteurService', () => {
  let service: ConnecteurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConnecteurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
