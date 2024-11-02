import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-tax-bureau',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './tax-bureau.component.html',
    styleUrls: ['./tax-bureau.component.css'],
  })
  export class TaxBureauComponent {
    @Input() taxBureaus: Array<{code: string, label: string}> = [];
    @Input() selectedTaxBureau: string = '';
    @Output() selectedTaxBureauChange = new EventEmitter<string>();
  
    isDropdownOpen = false;
  
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    }
  
    selectOption(code: string) {
      this.selectedTaxBureau = code;
      this.selectedTaxBureauChange.emit(code);
      this.isDropdownOpen = false;
    }
  
    getTaxBureauLabel(code: string): string {
      const bureau = this.taxBureaus.find(bureau => bureau.code === code);
      return bureau ? bureau.label : '';
    }
  
    // 添加点击外部关闭下拉框的处理
    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
      const element = event.target as HTMLElement;
      if (!element.closest('.custom-select')) {
        this.isDropdownOpen = false;
      }
    }
  }