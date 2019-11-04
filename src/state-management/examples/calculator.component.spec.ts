import { CalculatorService } from "./calculator.service";
import { CalculatorComponent } from "./calculator.component";
import { mockStoreDependencyService } from "../store-dependency.service";


describe( 'Calculator component', () => {
  let service: CalculatorService;
  let component: CalculatorComponent;
  beforeEach( function () {
    service = new CalculatorService( mockStoreDependencyService );
    component = new CalculatorComponent( service );
  } );

  afterEach( function () {
    service.ngOnDestroy();
    component.ngOnDestroy();
    service = null;
    component = null;
  } );

  it( 'It Should be able to detect the store in this component', ( done: any ) => {
    component.ngOnInit();

    setTimeout( () => {
      expect( component.state ).toEqual( { currentValue: 0 } );
      done();
    } )
  } );

} )
