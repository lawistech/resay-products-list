// src/app/features/products/product-details-modal/product-details-modal.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-details-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details-modal.component.html'
})
export class ProductDetailsModalComponent {
  @Input() product: Product | null = null;
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();

  close(): void {
    this.closeModal.emit();
  }

  getStockStatusClass(status: string): string {
    switch (status) {
      case 'instock':
        return 'text-green-600 bg-green-100';
      case 'outofstock':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  }

  getStockStatusText(status: string): string {
    switch (status) {
      case 'instock':
        return 'In Stock';
      case 'outofstock':
        return 'Out of Stock';
      default:
        return 'On Backorder';
    }
  }
}