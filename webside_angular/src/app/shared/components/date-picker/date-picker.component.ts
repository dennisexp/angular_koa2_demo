// date-picker.component.ts
import { Component, forwardRef, ElementRef, ViewChildren, QueryList, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { ClickOutsideDirective } from './click-outside.directive';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CommonModule, FormsModule, ClickOutsideDirective],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true
    }
  ],
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
})
export class DatePickerComponent implements ControlValueAccessor, OnInit  {
  @ViewChildren('dropdownItem') dropdownItems!: QueryList<ElementRef>;

  yearList = Array.from({length: 7}, (_, i) => new Date().getFullYear() - 3 + i);
  monthList = Array.from({length: 12}, (_, i) => i + 1);
  dayList = Array.from({length: 31}, (_, i) => i + 1);

  selectedYear: number | null = null;
  selectedMonth: number | null = null;
  selectedDay: number | null = null;

  showYearDropdown = false;
  showMonthDropdown = false;
  showDayDropdown = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit() {
    const { year, month, day } = this.getBeijingDate();
    // console.log('dateStr: ', dateStr);
    this.selectedYear = year;
    this.selectedMonth = month;
    this.selectedDay = day;
  }

  private getBeijingDate(): {year: number, month: number, day: number} {
    const date = new Date();
    // 设置为北京时间
    const beijingDate = new Date(date.getTime() + (date.getTimezoneOffset() + 480) * 60000);
    
    const year = beijingDate.getFullYear();
    const month = +String(beijingDate.getMonth() + 1).padStart(2, '0') + 0;
    const day = +String(beijingDate.getDate()).padStart(2, '0');
    
    return { year, month, day };
  }

  private getDaysInMonth(year: number, month: number): number {
    // 注意: JavaScript中月份是0-11
    return new Date(year, month, 0).getDate();
  }

  // 新增：判断是否为闰年
  private isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  // 新增：更新天数列表
  private updateDayList() {
    if (this.selectedYear && this.selectedMonth) {
      const daysInMonth = this.getDaysInMonth(this.selectedYear, this.selectedMonth);
      this.dayList = Array.from({length: daysInMonth}, (_, i) => i + 1);
      
      // 如果当前选中的日期超出了当月的最大天数，需要调整
      if (this.selectedDay && this.selectedDay > daysInMonth) {
        this.selectedDay = daysInMonth;
        this.updateValue();
      }
    }
  }

  // 滚动到选中项
  scrollToSelected(type: 'year' | 'month' | 'day'): void {
    setTimeout(() => {
      const selectedElement = this.dropdownItems.find(item => {
        const el = item.nativeElement as HTMLElement;
        return el.classList.contains('selected');
      });

      if (selectedElement) {
        selectedElement.nativeElement.scrollIntoView({
          block: 'center',
          behavior: 'auto'
        });
      }
    });
  }

  toggleDropdown(type: 'year' | 'month' | 'day') {
    this.closeAllDropdowns();
    // 关闭其他下拉框
    // if (type !== 'year') this.showYearDropdown = false;
    // if (type !== 'month') this.showMonthDropdown = false;
    // if (type !== 'day') this.showDayDropdown = false;

    switch(type) {
      case 'year':
        this.showYearDropdown = !this.showYearDropdown;
        if (this.showYearDropdown) {
          this.scrollToSelected('year');
        }
        break;
      case 'month':
        this.showMonthDropdown = !this.showMonthDropdown;
        if (this.showMonthDropdown) {
          this.scrollToSelected('month');
        }
        break;
      case 'day':
        this.showDayDropdown = !this.showDayDropdown;
        if (this.showDayDropdown) {
          this.scrollToSelected('day');
        }
        break;
    }
  }

  closeAllDropdowns() {
    this.showYearDropdown = false;
    this.showMonthDropdown = false;
    this.showDayDropdown = false;
  }

  selectYear(year: number) {
    this.selectedYear = year;
    this.showYearDropdown = false;
    this.updateDayList();  // 更新天数列表
    this.updateValue();
  }

  selectMonth(month: number) {
    this.selectedMonth = month;
    this.showMonthDropdown = false;
    this.updateDayList();  // 更新天数列表
    this.updateValue();
  }

  selectDay(day: number) {
    this.selectedDay = day;
    this.showDayDropdown = false;
    this.updateValue();
  }

  updateValue() {
    if (this.selectedYear && this.selectedMonth && this.selectedDay) {
      // 确保日期合法
      const daysInMonth = this.getDaysInMonth(this.selectedYear, this.selectedMonth);
      if (this.selectedDay <= daysInMonth) {
        const dateString = `${this.selectedYear}-${String(this.selectedMonth).padStart(2, '0')}-${String(this.selectedDay).padStart(2, '0')}`;
        this.onChange(dateString);
      }
    }
  }

  writeValue(value: string): void {
    if (value) {
      const [year, month, day] = value.split('-');
      this.selectedYear = +year;
      this.selectedMonth = +month;
      this.updateDayList();  // 更新天数列表
      this.selectedDay = +day;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // 防止事件冒泡
  stopPropagation(event: Event): void {
    event.stopPropagation();
  }
}