import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, AlertController } from '@ionic/angular';

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
  public uGate: string;
  public uGatePlaceholder = '{{1,0}, {0,-1}, {0,1}, {1,0}}';

  constructor(
    public navParams: NavParams,
    public modalController: ModalController,
    private alertController: AlertController
  ) {
    this.gateData = navParams.data;
    this.gateType = JSON.parse(JSON.stringify(this.gateData.type));
  }

  ngOnInit() {}

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Obligatory field',
      message: 'Associated U gate cannot be empty',
      buttons: ['OK']
    });
    await alert.present();
  }

  saveParameters() {
    let gatesParameters;
    let canSaveData = true;
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
      if (this.uGate === undefined) {
        canSaveData = false;
      } else {
        gatesParameters = {
          uGate: this.uGate,
          kParameter: this.kParameter
        };
      }
    }
    if (canSaveData) {
      this.modalController.dismiss(gatesParameters);
    } else {
      this.presentAlert();
    }
  }

}
