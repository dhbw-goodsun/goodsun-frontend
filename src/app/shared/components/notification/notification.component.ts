import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})

export class NotificationComponent {

  @Input() type: string = "";
  @Output() onClose = new EventEmitter<any>();

  close() {
    this.onClose.emit();
  }
}
