// register.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { finalize } from 'rxjs/operators';

import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^1[3-9]\d{9}$/)]],
      username: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // 自定义验证器：确保密码匹配
  private passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    // 标记所有控件为已触摸，触发验证器显示错误
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });

    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      const { phone, username, password } = this.registerForm.value;

      this.authService.register(phone, password, username)
        .pipe(
          finalize(() => {
            this.isLoading = false;
            console.log('Registration request completed');
          })
        )
        .subscribe({
          next: (response) => {
            console.log('Registration success:', response);
            // 成功注册后的处理已经在 AuthService 中完成
          },
          error: (error: Error | HttpErrorResponse) => {
            console.log('registration page error:', error);
            this.errorMessage = error.message;

            if (error instanceof HttpErrorResponse) {
              // 处理 HTTP 错误响应
              if (error.error && typeof error.error === 'object' && 'message' in error.error) {
                this.errorMessage = error.error.message;
              } else {
                this.errorMessage = error.message;
              }
            } else {
              // 处理其他类型的错误
              this.errorMessage = error.message || '注册失败，请稍后重试';
            }
            
            // 确保错误消息显示在UI上
            console.log('Error message set to:', this.errorMessage);
          }
        });
    }else {
      console.log('Form is invalid:', this.registerForm.errors);
    }
  }

  // 用于模板中显示具体的验证错误
  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
    if (control?.hasError('required')) {
      return '此字段必填';
    }
    if (control?.hasError('pattern') && controlName === 'phone') {
      return '请输入有效的手机号码';
    }
    if (control?.hasError('minlength')) {
      return `最少需要 ${control.errors?.['minlength'].requiredLength} 个字符`;
    }
    if (control?.hasError('maxlength')) {
      return `最多允许 ${control.errors?.['maxlength'].requiredLength} 个字符`;
    }
    if (this.registerForm.hasError('mismatch') && controlName === 'confirmPassword') {
      return '两次输入的密码不一致';
    }
    return '';
  }
}