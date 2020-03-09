import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalBaseComponent } from 'src/components/modal-base/modal-base.component';
import { QuditDetailsComponent } from './qudit-details/qudit-details.component';
import { GateDetailsComponent } from './gate-details/gate-details.component';

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
  public finalCircuit: any;
  public finalCircuitUsingJSON: any;
  public showFinalJSON = false;
  public showQuditsActived = false;

  constructor(
    public modalController: ModalController
  ) { }

  ngOnInit() {
  }

  showQudits() {
    this.showQuditsActived = true;
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
    this.showCircuit();
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
    this.circuit[i].gates = '';
    this.currentStep = i;
    if (type.detail.value === 'function') {
      this.showFunctions = true;
      this.showGates = false;
    } else if (type.detail.value === 'gates') {
      this.showFunctions = false;
      this.showGates = true;
    }
  }

  insertGate(gate) {
    if (gate === 'W' || gate === 'X' || gate === 'Z' || gate === 'GQFT' || gate === 'GQFT†' || gate === 'U') {
      this.presentGateModal(gate).then();
    } else {
      this.circuit[this.currentStep].gates = (this.circuit[this.currentStep].gates === '') ?
        gate : this.circuit[this.currentStep].gates + ';' + gate;
    }
  }

  async presentGateModal(type) {
    const modal = await this.modalController.create({
      component: ModalBaseComponent,
      cssClass: 'gate-details-modal',
      componentProps: {
        rootPage: GateDetailsComponent,
        modalData: {
          type
        }
      }
    });
    modal.onDidDismiss()
      .then((data) => {
        if (data.data !== undefined) {
          let gate;
          if (type === 'W') {
            gate = 'W(' + data.data.pParameter + ',' + data.data.qParameter + ')';
          } else if (type === 'X') {
            gate = 'X^' + data.data.mParameter;
          } else if (type === 'Z') {
            gate = 'Z^' + data.data.mParameter;
          } else if (type === 'GQFT') {
            gate = 'GQFT(' + data.data.nParameter + ')';
          } else if (type === 'GQFT†') {
            gate = 'GQFT†(' + data.data.nParameter + ')';
          } else if (type === 'U') {
            gate = 'U^' + data.data.kParameter;
          }
          this.circuit[this.currentStep].gates = (this.circuit[this.currentStep].gates === '') ?
            gate : this.circuit[this.currentStep].gates + ';' + gate;
        }
    });
    return await modal.present();
  }

  insertFunction(gate) {
    this.circuit[this.currentStep].gates = gate;
  }

  createJSON() {
    const coefficients = [];
    const circuitJSON = {
      qudits: 0,
      dimensions: 0,
      qRegister: coefficients,
      steps: []
    };
    circuitJSON.qudits = this.quditsNumber;
    circuitJSON.dimensions = this.quditsDimension;
    for (const [i, qudit] of this.quditsInfo.entries()) {
      const quditCoefficients = [];
      for (const [j, coefficientsGroup] of qudit.coefficients.entries()) {
        quditCoefficients.push('(' + coefficientsGroup[0] + ',' + coefficientsGroup[1] + ')');
      }
      coefficients.push(quditCoefficients);
    }
    circuitJSON.qRegister = coefficients;
    for (const [i, step] of this.circuit.entries()) {
      if (step.apply === 'gates') {
        circuitJSON.steps.push({
          applyGates: step.gates
        });
      } else if (step.apply === 'function') {
        circuitJSON.steps.push({
          applyFunction: step.gates
        });
      }
    }
    this.finalCircuit = JSON.stringify(circuitJSON, null, 2);
    this.showFinalJSON = true;
  }

  usingJSONChanged(value) {
    if (value.detail.checked) {
      this.usingJSON = true;
    } else {
      this.usingJSON = false;
    }
  }

  editCircuit() {
    this.showFinalJSON = false;
  }

  resetCircuit() {
    if (this.usingJSON) {
      this.finalCircuitUsingJSON = '';
    } else {
      this.showQuditsActived = false;
    }
  }

  confirmCircuit() {
    console.log('send this circuit: ', this.finalCircuit);
  }

}
