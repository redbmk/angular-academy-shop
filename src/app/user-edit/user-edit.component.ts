import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from '../models/user';
import { Store } from '@ngrx/store';
import { State } from '../reducers';
import { LogoutAction } from '../actions/auth';
import { UpdateAction, DeleteAction } from '../actions/user';

@Component({
  selector: 'app-user-edit',
  template: `
    <md-card>
      <md-card-header>
        <img md-card-avatar [src]="form.controls.photoURL.value">
        <md-card-title>Edit user profile</md-card-title>
        <md-card-subtitle>{{ user.email }}</md-card-subtitle>
      </md-card-header>
      <md-card-content>
        <p>
          <md-form-field>
            <input mdInput placeholder="Name" [formControl]="form.controls.displayName">
          </md-form-field>
          <md-form-field>
            <input mdInput placeholder="Photo URL" [formControl]="form.controls.photoURL">
          </md-form-field>
          <span *ngIf="canEditMetadata">
            <md-checkbox [formControl]="form.controls.isAdmin">Admin</md-checkbox>
            <br>
            <md-checkbox [formControl]="form.controls.isManager">Manager</md-checkbox>
          </span>
          <md-form-field>
            <textarea mdInput mdTextareaAutosize
                placeholder="Billing Address"
                [formControl]="form.controls.billingAddress">
            </textarea>
          </md-form-field>
          <md-form-field>
            <textarea mdInput mdTextareaAutosize
                placeholder="Shipping Address"
                [formControl]="form.controls.shippingAddress">
            </textarea>
          </md-form-field>
        </p>
      </md-card-content>
      <md-card-actions>
        <button md-button color="warn" *ngIf="canEditMetadata" [disabled]="isCurrentUser" (click)="deleteUser()">DELETE</button>
        <button md-button *ngIf="canCancel" (click)="cancelEdits()">CANCEL</button>
        <button md-button [disabled]="form.pristine" (click)="saveEdits()">SAVE</button>
        <button md-button *ngIf="isCurrentUser" (click)="signOut()">SIGN OUT</button>
      </md-card-actions>
    </md-card>
  `,
  styles: [`
    md-form-field {
      width: 100%;
    }
  `]
})
export class UserEditComponent implements OnInit {
  public form: FormGroup;

  @Input() user: User;
  @Input() isCurrentUser = false;
  @Input() canEditMetadata = false;
  @Input() canCancel = false;

  @Output() onDone = new EventEmitter<any>();

  get canDelete() {
    return this.canEditMetadata && !this.isCurrentUser;
  }

  constructor(private store: Store<State>, private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      billingAddress: '',
      shippingAddress: '',
      ...this.user,
      isAdmin: { value: this.user.isAdmin || false, disabled: this.isCurrentUser },
      isManager: this.user.isManager || false,
    });
  }

  deleteUser() {
    this.store.dispatch(new DeleteAction(this.user));
    this.onDone.emit();
  }

  cancelEdits() {
    this.onDone.emit();
  }

  saveEdits() {
    this.store.dispatch(new UpdateAction(this.form.value));
    this.onDone.emit();
  }

  signOut() {
    this.store.dispatch(new LogoutAction());
  }
}
