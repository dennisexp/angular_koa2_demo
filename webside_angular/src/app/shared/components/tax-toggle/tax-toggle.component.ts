// tax-toggle.component.ts
import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-tax-toggle',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TaxToggleComponent),
      multi: true
    }
  ],
  template: `
    <div class="tax-toggle" 
         [class.active]="value" 
         (click)="toggle()">
      <span class="toggle-text">含税</span>
      <div class="toggle-circle"></div>
    </div>
  `,
  styles: [`
    .tax-toggle {
      width: 90px;
      height: 32px;
      background-color: #f0f0f0;
      border-radius: 16px;
      position: relative;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
    }

    .toggle-text {
      color: #666;
      font-size: 14px;
      margin-left: 16px;
      user-select: none;
    }

    .toggle-circle {
      position: absolute;
      right: 4px;
      width: 24px;
      height: 24px;
      background-color: #fff;
      border-radius: 50%;
      transition: all 0.3s ease;
    }

    .tax-toggle.active {
      background-color: #1976d2;
    }

    .tax-toggle.active .toggle-text {
      color: #fff;
    }

    .tax-toggle.active .toggle-circle {
      right: calc(100% - 28px);
    }
  `]
})
export class TaxToggleComponent implements ControlValueAccessor {
  value: boolean = false;
  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  toggle() {
    this.value = !this.value;
    this.onChange(this.value);
    this.onTouched();
  }

  writeValue(value: boolean): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // 实现禁用状态的逻辑（如果需要）
  }
}