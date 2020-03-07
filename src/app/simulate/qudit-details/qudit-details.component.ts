import { Component, OnInit, Input } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-qudit-details',
  templateUrl: './qudit-details.component.html',
  styleUrls: ['./qudit-details.component.scss'],
})
export class QuditDetailsComponent implements OnInit {

  public quditData: any;
  public quditCoefficients = [];

  constructor(
    public navParams: NavParams,
    public modalController: ModalController
  ) {
    this.quditData = navParams.data;
    this.quditCoefficients = JSON.parse(JSON.stringify(this.quditData.coefficients));
  }

  ngOnInit() {
  }

  saveCoefficients() {
    this.modalController.dismiss(this.quditCoefficients);
  }

}
