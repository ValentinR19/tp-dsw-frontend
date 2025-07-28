import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IFormLogin } from '@auth-module/models/interfaces/forms/login-form.interface';
import { AuthService } from '@auth-module/services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MessageService } from '@main-module/app/shared/services/message.service';
import { IftaLabelModule } from 'primeng/iftalabel';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, IftaLabelModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [AuthService, JwtHelperService],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading: boolean = false;

  private readonly authService: AuthService = inject(AuthService);
  private readonly messageService: MessageService = inject(MessageService);
  private fb: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);

  constructor() {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit(): void {
    this.initLoginForm();
  }

  initLoginForm() {
    this.loginForm = new FormGroup<IFormLogin>({
      username: new FormControl<string>('', Validators.compose([Validators.required])),
      password: new FormControl<string>('', Validators.compose([Validators.required])),
    });
  }

  submit() {
    this.loading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {},
      error: (err) => {
        this.loading = false;
        this.messageService.showErrorMessage(err);
      },
      complete: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
    });
  }
}
