// src/app/features/products/product-list/product-list.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WooCommerceService } from '../../../core/services/woocommerce.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading = false;
  error = '';
  currentPage = 1;
  totalPages = 1;
  perPage = 10;
  selectedWebsite = 'resay'; // Default website
  searchForm: FormGroup;
  websites = [
    { id: 'resay', name: 'Resay' },
    { id: 'barcodesforbusiness', name: 'Barcodes For Business' },
    { id: 'androidepos', name: 'Android EPOS' }
  ];

  constructor(
    private wooCommerceService: WooCommerceService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      searchTerm: [''],
      website: [this.selectedWebsite]
    });
  }

  ngOnInit(): void {
    this.loadProducts();

    // Subscribe to form value changes to filter products
    this.searchForm.get('website')?.valueChanges.subscribe(website => {
      this.selectedWebsite = website;
      this.currentPage = 1; // Reset to first page
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.isLoading = true;
    this.error = '';

    this.wooCommerceService.getProducts(this.selectedWebsite, this.currentPage, this.perPage)
      .subscribe({
        next: (products) => {
          this.products = products;
          this.filteredProducts = [...products];
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching products:', err);
          this.error = 'Failed to load products. Please try again later.';
          this.isLoading = false;
        }
      });
  }

  search(): void {
    const searchTerm = this.searchForm.get('searchTerm')?.value;
    
    if (!searchTerm) {
      this.filteredProducts = [...this.products];
      return;
    }

    this.isLoading = true;
    this.wooCommerceService.searchProducts(this.selectedWebsite, searchTerm)
      .subscribe({
        next: (products) => {
          this.filteredProducts = products;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error searching products:', err);
          this.error = 'Failed to search products. Please try again later.';
          this.isLoading = false;
        }
      });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadProducts();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadProducts();
    }
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

  getWebsiteName(websiteId: string): string {
    const website = this.websites.find(w => w.id === websiteId);
    return website ? website.name : websiteId;
  }
}