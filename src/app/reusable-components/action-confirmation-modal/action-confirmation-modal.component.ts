import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Input,Output } from '@angular/core';
import { IonModal } from "@ionic/angular/standalone";

@Component({
  selector: 'app-action-confirmation-modal',
  templateUrl: './action-confirmation-modal.component.html',
  styleUrls: ['./action-confirmation-modal.component.scss'],
  standalone: true,
  imports: [IonModal, CommonModule]
})
export class ActionConfirmationModalComponent  implements OnInit {

  @Input() isOpen: boolean = false;
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() buttons: { text: string, action: string }[] = [];
  @Input() showBackButton: boolean = true;

  @Output() willDismiss: EventEmitter<void> = new EventEmitter<void>();
  @Output() buttonClick: EventEmitter<string> = new EventEmitter<string>();

  closeModal() {
    this.willDismiss.emit();
  }

  handleButtonClick(action: string) {
    this.buttonClick.emit(action);
  }
  constructor() { }

  ngOnInit() {}

}
