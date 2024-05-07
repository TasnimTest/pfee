import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogueFormationAdminComponent } from './catalogue-formation-admin.component';

describe('CatalogueFormationAdminComponent', () => {
  let component: CatalogueFormationAdminComponent;
  let fixture: ComponentFixture<CatalogueFormationAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogueFormationAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CatalogueFormationAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
