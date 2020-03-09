import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-gate-details',
  templateUrl: './gate-details.component.html',
  styleUrls: ['./gate-details.component.scss'],
})
export class GateDetailsComponent implements OnInit {

  public gateData: any;
  public gateType: any;
  public pParameter = 0;
  public qParameter = 0;
  public mParameter = 1;
  public nParameter = 1;
  public kParameter = 1;

  constructor(
    public navParams: NavParams,
    public modalController: ModalController
  ) {
    this.gateData = navParams.data;
    this.gateType = JSON.parse(JSON.stringify(this.gateData.type));
  }

  ngOnInit() {}

  saveParameters() {
    let gatesParameters;
    if (this.gateType === 'W') {
      gatesParameters = {
        pParameter: this.pParameter,
        qParameter: this.qParameter
      };
    } else if (this.gateType === 'X' || this.gateType === 'Z') {
      gatesParameters = {
        mParameter: this.mParameter
      };
    } else if (this.gateType === 'GQFT' || this.gateType === 'GQFT†') {
      gatesParameters = {
        nParameter: this.nParameter
      };
    } else if (this.gateType === 'U') {
      gatesParameters = {
        kParameter: this.kParameter
      };
    }
    this.modalController.dismiss(gatesParameters);
  }

}
