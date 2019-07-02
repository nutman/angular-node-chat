import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ChatComponent} from "./components/chat/chat.component";
import { SharedModule } from './shared/shared.module';
import { DialogUserComponent } from './components/chat/dialog-user/dialog-user.component';
import {SocketService} from "./components/chat/services/socket.service";
import { UsersComponent } from './components/chat/users/users.component';
import { ChatMessagesComponent } from './components/chat/chat-messages/chat-messages.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    DialogUserComponent,
    UsersComponent,
    ChatMessagesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
  ],
  providers: [SocketService],
  entryComponents: [DialogUserComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
