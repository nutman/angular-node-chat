import {Component, Input, OnInit} from '@angular/core';
import {Message} from "../../../models/message";
import {Action} from "../../../models/action";
import {User} from "../../../models/user";

@Component({
  selector: 'app-chat-messages',
  templateUrl: './chat-messages.component.html',
  styleUrls: ['./chat-messages.component.scss']
})
export class ChatMessagesComponent implements OnInit {
  @Input() messages: Message[];
  @Input() user: User;

  public action = Action;

  constructor() { }

  ngOnInit() {
  }

}
