export enum StoreTheme {
  MODERN = 'Modern Minimalist',
  BOLD = 'Bold & Vibrant',
  ELEGANT = 'Elegant Luxury'
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

export interface GeneratedContent {
  description: string;
  imageUrl?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number; // In MAD
  period: 'monthly' | 'yearly';
  features: string[];
  recommended?: boolean;
}

export interface AIOrderConfig {
  language: 'French' | 'Arabic (Standard)' | 'Darija (Moroccan)';
  tone: 'Professional' | 'Friendly' | 'Urgent';
  includeDiscount: boolean;
  template: string;
}