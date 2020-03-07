import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SimulatePage } from './simulate.page';

describe('SimulatePage', () => {
  let component: SimulatePage;
  let fixture: ComponentFixture<SimulatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimulatePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SimulatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
