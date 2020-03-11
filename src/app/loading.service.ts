import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  public isLoading = false;

  constructor(public loadingController: LoadingController) { }

  async present(message?: string) {
    this.isLoading = true;
    const loader = await this.loadingController.create({
      message: message || 'Cargando',
      spinner: 'crescent'
    });
    return await loader.present();
  }

  async dismiss() {
    if (this.isLoading) {
      this.isLoading = false;
      return await this.loadingController.dismiss();
    }
  }
}
