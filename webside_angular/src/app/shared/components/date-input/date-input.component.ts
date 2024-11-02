// date-input.component.ts
import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-date-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateInputComponent),
      multi: true
    }
  ],
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.css'],
})
export class DateInputComponent implements ControlValueAccessor {
  dateForm: FormGroup;
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private fb: FormBuilder) {
    this.dateForm = this.fb.group({
      year: [''],
      month: [''],
      day: ['']
    });

    this.dateForm.valueChanges.subscribe(value => {
      if (this.isValidDate(value)) {
        this.onChange(`${value.year}-${value.month}-${value.day}`);
      }
    });
  }

  onInput(field: string, event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    
    if (field === 'month' && +value > 12) value = '12';
    if (field === 'day' && +value > 31) value = '31';
    
    this.dateForm.patchValue({ [field]: value }, { emitEvent: false });
  }

  writeValue(value: string): void {
    if (value) {
      const [year, month, day] = value.split('-');
      this.dateForm.patchValue({
        year,
        month,
        day
      }, { emitEvent: false });
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  private isValidDate({ year, month, day }: any): boolean {
    if (!year || !month || !day) return false;
    const date = new Date(+year, +month - 1, +day);
    return date.getFullYear() === +year && 
           date.getMonth() === +month - 1 && 
           date.getDate() === +day;
  }
}