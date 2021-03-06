import {Component, OnInit, ViewChildren, ViewChild, AfterViewInit, QueryList, ElementRef} from '@angular/core';
import {MatDialog, MatDialogRef, MatList, MatListItem} from '@angular/material';

import {Action} from "../../models/action";
import {Event} from '../../models/event';
import {Message} from '../../models/message';
import {User} from '../../models/user';
import {SocketService} from "./services/socket.service";
import {DialogUserComponent} from "./dialog-user/dialog-user.component";
import {DialogUserType} from "./dialog-user/dialog-user-type";


const AVATAR_URL = 'https://api.adorable.io/avatars/285';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit {
  public action = Action;
  public user: User;
  public users: User[] = [];
  public messages: Message[] = [];
  public messageContent: string;
  public ioConnection: any;
  public dialogRef: MatDialogRef<DialogUserComponent> | null;
  public defaultDialogUserParams: any = {
    disableClose: true,
    data: {
      title: 'Welcome',
      dialogType: DialogUserType.NEW
    }
  };

  // getting a reference to the overall list, which is the parent container of the list items
  @ViewChild(MatList, {static: false, read: ElementRef}) matList: ElementRef;

  // getting a reference to the items/messages within the list
  @ViewChildren(MatListItem, {read: ElementRef}) matListItems: QueryList<MatListItem>;

  constructor(
    private socketService: SocketService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.initModel();
    // Using timeout due to https://github.com/angular/angular/issues/14748
    setTimeout(() => {
      this.openUserPopup(this.defaultDialogUserParams);
    }, 0);
  }

  ngAfterViewInit(): void {
    // subscribing to any changes in the list of items / messages
    this.matListItems.changes.subscribe(elements => {
      this.scrollToBottom();
    });
  }

  // auto-scroll fix: inspired by this stack overflow post
  // https://stackoverflow.com/questions/35232731/angular2-scroll-to-bottom-chat-style
  private scrollToBottom(): void {
    try {
      // this.matList.nativeElement.scrollTop = this.matList.nativeElement.scrollHeight;
    } catch (err) {
    }
  }

  private initModel(): void {
    const randomId = this.getRandomId();
    this.user = {
      id: randomId,
      avatar: `${AVATAR_URL}/${randomId}.png`
    };
  }

  private initIoConnection(): void {
    this.socketService.initSocket();

    this.ioConnection = this.socketService.onMessage()
      .subscribe((message: Message) => {
        this.messages.push(message);
      });

    this.ioConnection = this.socketService.onUser()
      .subscribe((users: User[]) => {
        this.users = users;
      });


    this.socketService.onEvent(Event.CONNECT)
      .subscribe(() => {
        console.log('connected');
      });

    this.socketService.onEvent(Event.DISCONNECT)
      .subscribe(() => {
        console.log('disconnected');
      });
  }

  private getRandomId(): number {
    return Math.floor(Math.random() * (1000000)) + 1;
  }

  public onClickUserInfo() {
    this.openUserPopup({
      data: {
        username: this.user.name,
        title: 'Edit Details',
        dialogType: DialogUserType.EDIT
      }
    });
  }

  private openUserPopup(params): void {
    this.dialogRef = this.dialog.open(DialogUserComponent, params);
    this.dialogRef.afterClosed().subscribe(paramsDialog => {
      if (!paramsDialog) {
        return;
      }

      this.user.name = paramsDialog.username;
      if (paramsDialog.dialogType === DialogUserType.NEW) {
        this.initIoConnection();
        this.sendNotification(paramsDialog, Action.JOINED);
      } else if (paramsDialog.dialogType === DialogUserType.EDIT) {
        this.sendNotification(paramsDialog, Action.RENAME);
      }
    });
  }

  public sendMessage(message: string): void {
    if (!message) {
      return;
    }
    const date = new Date();
    this.socketService.send({
      from: this.user,
      content: message,
      date: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    });
    this.messageContent = null;
  }

  public sendNotification(
    params: any, action: Action
  ): void {
    let message: Message;

    if (action === Action.JOINED) {
      message = {
        from: this.user,
        action: action
      }
    } else if (action === Action.RENAME) {
      message = {
        action: action,
        content: {
          username: this.user.name,
          previousUsername: params.previousUsername
        }
      };
    } else if (action === Action.LEFT) {
      message = {
        action: action,
        content: {
          username: this.user.name
        }
      };
    }
    this.socketService.sendNotification(message);
  }

  public addUserName(name: string) {
    this.messageContent = `${this.messageContent ? this.messageContent: ''} <b>@${name}</b>`;
  }
}
