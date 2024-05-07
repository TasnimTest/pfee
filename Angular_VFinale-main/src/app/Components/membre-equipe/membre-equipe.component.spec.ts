import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembreEquipeComponent } from './membre-equipe.component';

describe('MembreEquipeComponent', () => {
  let component: MembreEquipeComponent;
  let fixture: ComponentFixture<MembreEquipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembreEquipeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MembreEquipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
