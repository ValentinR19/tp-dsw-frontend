import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BackButtonComponent } from '@main-module/app/shared/components/back-button/back-button.component';
import { MessageService } from '@main-module/app/shared/services/message.service';
import { User } from '@main-module/app/users/models/classes/user.entity';
import { UserService } from '@main-module/app/users/services/user.service';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { IftaLabelModule } from 'primeng/iftalabel';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { lastValueFrom, take } from 'rxjs';

@Component({
  selector: 'app-user-editor',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, BackButtonComponent, DividerModule, IftaLabelModule, ToggleSwitchModule],
  templateUrl: './user-editor.component.html',
  styleUrl: './user-editor.component.scss',
})
export class UserEditorComponent implements OnInit {
  user: User;
  userForm: FormGroup;
  userId: number;

  roles: any[] = [];

  private readonly userService: UserService = inject(UserService);
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly messageService: MessageService = inject(MessageService);

  async ngOnInit(): Promise<void> {
    this.buildForm();
    const params = await lastValueFrom(this.route.params.pipe(take(1)));
    console.log(params);
    this.userId = Number(params['id']);

    if (this.userId) {
      this.userService.getById(this.userId).subscribe({
        next: (user: User) => {
          this.user = user;
          this.userForm.patchValue(user);
          this.userForm.get('username').disable();
        },
        error: (error) => {
          this.messageService.showErrorFromDTO(`Error al obtener el usuario ${error}`);
        },
      });
    }
  }

  buildForm() {
    this.userForm = new FormGroup({
      username: new FormControl<string>('', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]),
      password: new FormControl<string>('', [Validators.minLength(8), Validators.maxLength(25)]),
      firstName: new FormControl<string>('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
      lastName: new FormControl<string>('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
      email: new FormControl<string>('', [Validators.required, Validators.email, Validators.minLength(3), Validators.maxLength(30)]),
      active: new FormControl<boolean>(true, [Validators.required]),
    });
  }

  submit(): void {
    this.userForm.markAllAsTouched();
    if (this.userForm.invalid) return;

    this.userId ? this.update() : this.create();
  }

  create() {
    this.userService.create(this.userForm.value).subscribe({
      next: (user: User) => {
        this.messageService.showSuccessMessage('Usuario creado correctamente');
        this.router.navigate(['users']);
      },
      error: (error) => {
        this.messageService.showErrorFromDTO(`Error al crear el usuario ${error}`);
      },
    });
  }

  update() {
    this.userService.update({ id: this.userId, ...this.userForm.value }).subscribe({
      next: (user: User) => {
        this.messageService.showSuccessMessage('Usuario actualizado correctamente');
        this.router.navigate(['users']);
      },
      error: (error) => {
        this.messageService.showErrorFromDTO(`Error al actualizar el usuario ${error}`);
      },
    });
  }

  close(): void {
    this.router.navigate(['users']);
  }
}
