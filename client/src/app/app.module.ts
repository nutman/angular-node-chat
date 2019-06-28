import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ChatComponent} from "./components/chat/chat.component";
import { SharedModule } from './shared/shared.module';
import { DialogUserComponent } from './components/chat/dialog-user/dialog-user.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    DialogUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
  ],
  exports: [
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
