import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from "../../../models/user";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  @Input() users: User[];
  @Output() addUserName = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  public addUserNameToInput(name) {
    this.addUserName.emit(name);
  }
}
