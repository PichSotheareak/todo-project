import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

// Define interfaces for type safety
interface Rating {
  rate: number;
  count: number;
}

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, HttpClientModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'your-app-name';
  products: Product[] = [];
  categories: string[] = [];
  filteredProducts: Product[] = [];
  selectedCategory: string = 'all';
  searchTerm: string = '';
  loading: boolean = false;
  error: string = '';

  private readonly API_BASE_URL = 'https://fakestoreapi.com';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  // Load all products from API
  loadProducts(): void {
    this.loading = true;
    this.error = '';

    this.http.get<Product[]>(`${this.API_BASE_URL}/products`)
      .subscribe({
        next: (data) => {
          this.products = data;
          this.filteredProducts = [...this.products];
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading products:', err);
          this.error = 'Failed to load products. Please try again later.';
          this.loading = false;
        }
      });
  }

  // Load categories from API
  loadCategories(): void {
    this.http.get<string[]>(`${this.API_BASE_URL}/products/categories`)
      .subscribe({
        next: (data) => {
          this.categories = data;
        },
        error: (err) => {
          console.error('Error loading categories:', err);
        }
      });
  }

  // Filter products by category
  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  // Search products
  onSearch(): void {
    this.applyFilters();
  }

  // Apply both category and search filters
  private applyFilters(): void {
    let filtered = [...this.products];

    // Apply category filter
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === this.selectedCategory);
    }

    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
      );
    }

    this.filteredProducts = filtered;
  }

  // Generate star rating display
  generateStars(rating: number): string[] {
    const stars: string[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }

    // Half star
    if (hasHalfStar) {
      stars.push('☆');
    }

    // Empty stars
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push('☆');
    }

    return stars;
  }

  // Capitalize first letter of string
  capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Calculate discounted price (for display purposes)
  getOriginalPrice(price: number): number {
    const discountPercent = Math.floor(Math.random() * 30) + 10; // Random discount 10-40%
    return Number((price * (1 + discountPercent / 100)).toFixed(2));
  }

  // Get random discount percentage
  getDiscountPercent(): number {
    return Math.floor(Math.random() * 30) + 10;
  }

  // Retry loading products
  retryLoading(): void {
    this.loadProducts();
  }
}
