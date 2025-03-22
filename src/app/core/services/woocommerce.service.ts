// src/app/core/services/woocommerce.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Product } from '../models/product.model';

// Define website types for type safety
type WebsiteId = 'resay' | 'barcodesforbusiness' | 'androidepos' | 'bestore';

@Injectable({
  providedIn: 'root'
})
export class WooCommerceService {
  // Define websites with index signature
  private readonly websites: Record<WebsiteId, string> = {
    'resay': 'https://resay.co.uk/wp-json/wc/v3',
    'barcodesforbusiness': 'https://barcodesforbusiness.co.uk/wp-json/wc/v3',
    'androidepos': 'https://androidepos.co.uk/wp-json/wc/v3',
    'bestore': 'https://bestore.nangkil.com/wp-json/wc/v3'
  };

  // WooCommerce API credentials for each website with proper type
  private readonly credentials: Record<WebsiteId, { consumerKey: string; consumerSecret: string }> = {
    'resay': {
      consumerKey: 'YOUR_CONSUMER_KEY_HERE',
      consumerSecret: 'YOUR_CONSUMER_SECRET_HERE'
    },
    'barcodesforbusiness': {
      consumerKey: 'YOUR_CONSUMER_KEY_HERE',
      consumerSecret: 'YOUR_CONSUMER_SECRET_HERE'
    },
    'androidepos': {
      consumerKey: 'YOUR_CONSUMER_KEY_HERE',
      consumerSecret: 'YOUR_CONSUMER_SECRET_HERE'
    },
    'bestore': {
      consumerKey: 'ck_dbc558d52bf4bf21b212c6af314e61a37f1a036a',
      consumerSecret: 'cs_e7685c06d1728a0dbd1319935d9e70364522fc87'
    }
  };

  private http = inject(HttpClient);

  getProducts(website: WebsiteId, page: number = 1, perPage: number = 10): Observable<Product[]> {
    if (!this.websites[website]) {
      console.error(`Website ${website} is not supported`);
      return of([]);
    }

    const url = `${this.websites[website]}/products`;
    const params = new HttpParams()
      .set('consumer_key', this.credentials[website].consumerKey)
      .set('consumer_secret', this.credentials[website].consumerSecret)
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.http.get<any[]>(url, { params }).pipe(
      map(products => products.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        regularPrice: product.regular_price,
        salePrice: product.sale_price,
        imageUrl: product.images && product.images.length > 0 ? product.images[0].src : '',
        permalink: product.permalink,
        stockStatus: product.stock_status,
        website: website
      }))),
      catchError(error => {
        console.error('Error fetching products:', error);
        return of([]);
      })
    );
    
  }

  getProductById(website: WebsiteId, productId: number): Observable<Product> {
    if (!this.websites[website]) {
      throw new Error(`Website ${website} is not supported`);
    }

    const url = `${this.websites[website]}/products/${productId}`;
    const params = new HttpParams()
      .set('consumer_key', this.credentials[website].consumerKey)
      .set('consumer_secret', this.credentials[website].consumerSecret);

    return this.http.get<any>(url, { params }).pipe(
      map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        regularPrice: product.regular_price,
        salePrice: product.sale_price,
        imageUrl: product.images && product.images.length > 0 ? product.images[0].src : '',
        permalink: product.permalink,
        stockStatus: product.stock_status,
        website: website
      }))
    );
  }

  searchProducts(website: WebsiteId, searchTerm: string, page: number = 1, perPage: number = 10): Observable<Product[]> {
    if (!this.websites[website]) {
      console.error(`Website ${website} is not supported`);
      return of([]);
    }

  
    
    const url = `${this.websites[website]}/products`;
    const params = new HttpParams()
      .set('consumer_key', this.credentials[website].consumerKey)
      .set('consumer_secret', this.credentials[website].consumerSecret)
      .set('search', searchTerm)
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.http.get<any[]>(url, { params }).pipe(
      map(products => products.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        regularPrice: product.regular_price,
        salePrice: product.sale_price,
        imageUrl: product.images && product.images.length > 0 ? product.images[0].src : '',
        permalink: product.permalink,
        stockStatus: product.stock_status,
        website: website
      }))),
      catchError(error => {
        console.error('Error searching products:', error);
        return of([]);
      })
    );
  
  }

}