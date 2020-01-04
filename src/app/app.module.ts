import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// tslint:disable-next-line: max-line-length
import { NbThemeModule, NbLayoutModule, NbCardModule, NbListModule, NbInputModule, NbButtonModule, NbCheckboxModule, NbRadioModule, NbIconModule, NbSelectModule, NbUserModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { SurveyComponent } from './survey/survey.component';
import { HttpClientModule } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DragulaModule } from 'ng2-dragula';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectDirective } from './directives/select.directive';

const NEBULAR = [
  NbCardModule,
  NbListModule,
  NbInputModule,
  NbButtonModule,
  NbCheckboxModule,
  NbRadioModule,
  NbIconModule,
  NbSelectModule,
  NbUserModule
];

@NgModule({
  declarations: [
    AppComponent,
    SurveyComponent,
    SelectDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    NbEvaIconsModule,
    ...NEBULAR,
    // DragDropModule,
    DragulaModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
