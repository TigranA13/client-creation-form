import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CdkStepper } from '@angular/cdk/stepper';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper-container.component.html',
  styleUrls: ['./stepper-container.component.scss'],
  providers: [{ provide: CdkStepper, useExisting: StepperContainerComponent }]
})
export class StepperContainerComponent extends CdkStepper implements OnInit, OnChanges {
  @Input('stepData') stepData: any;
  @Input('isValid') isValid: any;
  @Output() stepChange: EventEmitter<number> = new EventEmitter<number>();
  validity = [false, false, false];

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes['stepData']) {
      this.stepData = changes['stepData'].currentValue;
    }
    if (changes && changes['isValid']) {
      this.validity[this.selectedIndex] = changes['isValid'].currentValue;
    }
  }

  ngOnInit(): void {
   this.getValidity();
  }

  getValidity() {
    const clientValid = sessionStorage.getItem('clientValid');
    const addressValid = sessionStorage.getItem('addressValid');
    const identityValid = sessionStorage.getItem('identityValid');
    this.validity[0] = clientValid && JSON.parse(clientValid);
    this.validity[1] = addressValid && JSON.parse(addressValid);
    this.validity[2] = identityValid && JSON.parse(identityValid);
  }

  onStepChange(i: number): void {
    this.getValidity();
    this.stepChange.emit(i);
  }
}
