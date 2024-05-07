import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogueFormationComponent } from './catalogue-formation.component';

describe('CatalogueFormationComponent', () => {
  let component: CatalogueFormationComponent;
  let fixture: ComponentFixture<CatalogueFormationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogueFormationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CatalogueFormationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
