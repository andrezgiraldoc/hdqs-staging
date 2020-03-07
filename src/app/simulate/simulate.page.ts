import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalBaseComponent } from 'src/components/modal-base/modal-base.component';
import { QuditDetailsComponent } from './qudit-details/qudit-details.component';

@Component({
  selector: 'app-simulate',
  templateUrl: './simulate.page.html',
  styleUrls: ['./simulate.page.scss'],
})
export class SimulatePage implements OnInit {

  public quditsNumber = 2;
  public quditsDimension = 2;
  public quditsInfo = [];
  public usingJSON = false;
  public circuitIsShown = false;
  public circuit = [];
  public currentStep = 0;
  public showGates = true;
  public showFunctions = false;

  constructor(
    public modalController: ModalController
  ) { }

  ngOnInit() {
  }

  showQudits() {
    this.quditsInfo = [];
    const coefficients = [];
    coefficients.push([1, 0]);
    for (let i = 0; i < this.quditsDimension - 1; i++) {
      coefficients.push([0, 0]);
    }
    for (let i = 0; i < this.quditsNumber; i++) {
      this.quditsInfo.push({
        type: 'standard basis',
        state: '0',
        coefficients
      });
    }
  }

  viewDetails(qudit) {
    this.presentModal(qudit).then();
  }

  async presentModal(qudit) {
    const modal = await this.modalController.create({
      component: ModalBaseComponent,
      cssClass: 'qudits-details-modal',
      componentProps: {
        rootPage: QuditDetailsComponent,
        modalData: {
          type: qudit.type,
          state: qudit.state,
          coefficients: qudit.coefficients
        }
      }
    });
    modal.onDidDismiss()
      .then((data) => {
        if (data.data !== undefined) {
          let isBasisVector;
          for (const [i, coefficient] of data.data.entries()) {
            if (coefficient[0] === '1' || coefficient[0] === 1) {
              isBasisVector = i;
            }
          }
          if (isBasisVector !== undefined) {
            qudit.type = 'standard basis';
            qudit.state = isBasisVector;
          } else {
            qudit.type = 'superposition';
            qudit.state = 'Psi';
          }
          qudit.coefficients = data.data;
        }
    });
    return await modal.present();
  }

  showCircuit() {
    this.circuitIsShown = true;
    this.circuit = [];
    this.circuit.push({
      apply: 'gates',
      gates: ''
    });
  }

  addStep() {
    this.circuit.push({
      apply: 'gates',
      gates: ''
    });
  }

  removeStep() {
    if (this.circuit.length > 1) {
      this.circuit.pop();
    }
  }

  onStep(i) {
    console.log('I am in step: ', i);
    this.currentStep = i;
    if (this.circuit[i].apply === 'function') {
      this.showFunctions = true;
      this.showGates = false;
    } else {
      this.showFunctions = false;
      this.showGates = true;
    }
  }

  applyChanges(type, i) {
    console.log('Change: ', type);
    this.circuit[i].gates = '';
    if (type.detail.value === 'function') {
      this.showFunctions = true;
      this.showGates = false;
    } else if (type.detail.value === 'gates') {
      this.showFunctions = false;
      this.showGates = true;
    }
  }

  insertGate(gate) {
    this.circuit[this.currentStep].gates = (this.circuit[this.currentStep].gates === '') ?
      gate : this.circuit[this.currentStep].gates + ';' + gate;
  }

  insertFunction(gate) {
    this.circuit[this.currentStep].gates = gate;
  }

}
