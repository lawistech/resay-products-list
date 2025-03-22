// src/app/core/models/product.model.ts
export interface Product {
    id: number;
    name: string;
    description: string;
    price: string;
    regularPrice: string;
    salePrice: string;
    imageUrl: string;
    permalink: string;
    stockStatus: string;
    website: string; // Identifies which website the product belongs to
  }