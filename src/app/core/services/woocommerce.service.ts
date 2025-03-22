// src/app/core/services/woocommerce.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class WooCommerceService {
  private readonly websites = {
    'resay': 'https://resay.co.uk/wp-json/wc/v3',
    'barcodesforbusiness': 'https://barcodesforbusiness.co.uk/wp-json/wc/v3',
    'androidepos': 'https://androidepos.co.uk/wp-json/wc/v3',
    'bestore':'https://bestore.nangkil.com/wp-json/wc/v3'
  };

  // WooCommerce API credentials for each website
  private readonly credentials = {
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

  constructor(private http: HttpClient) { }

  getProducts(website: string, page: number = 1, perPage: number = 10): Observable<Product[]> {
    if (!this.websites[website]) {
      throw new Error(`Website ${website} is not supported`);
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
      })))
    );
  }

  getProductById(website: string, productId: number): Observable<Product> {
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

  searchProducts(website: string, searchTerm: string, page: number = 1, perPage: number = 10): Observable<Product[]> {
    if (!this.websites[website]) {
      throw new Error(`Website ${website} is not supported`);
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
      })))
    );
  }
}