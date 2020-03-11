import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Simulate',
      url: '/simulate',
      icon: 'desktop'
    },
    {
      title: 'Instructions',
      url: '/instructions',
      icon: 'document-text'
    },
    {
      title: 'Results',
      url: '/results',
      icon: 'stats-chart'
    }
  ];
  public labels = [
    {
      name: 'Quirk',
      url: 'https://algassert.com/quirk'
    },
    {
      name: 'IBM Quantum Experience',
      url: 'https://quantum-computing.ibm.com/login'
    },
    {
      name: 'Qiskit',
      url: 'https://qiskit.org/'
    },
    {
      name: 'HD Optical Quantum Logic',
      url: 'https://www.nature.com/articles/s41534-019-0173-8'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
  }
}
