import { Component } from '@angular/core';
import { GetDataService } from './services/get-data.service';
import { NbIconLibraries } from '@nebular/theme';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Survey';
  constructor(private iconLibraries: NbIconLibraries) {
    this.iconLibraries.registerFontPack('fa', { packClass: 'fa', iconClassPrefix: 'fa' });
  }
}
