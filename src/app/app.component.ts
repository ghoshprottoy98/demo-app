import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import jsonData from './data/data.json'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'demo-app';

  draggedProduct: any = null;
  products: any[] = jsonData.products;

  ngOnInit() {
    this.loadProductPositions();
  }

  loadProductPositions() {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      this.products = JSON.parse(storedProducts);
    } else {
      this.initializeProductPositions();
    }
  }

  initializeProductPositions() {
    this.products = this.products.map(product => ({
      ...product,
      position: { left: Math.random() * (window.innerWidth - 200), top: Math.random() * (window.innerHeight - 250) }
    }));
    this.saveProductPositions();
  }

  saveProductPositions() {
    localStorage.setItem('products', JSON.stringify(this.products));
  }

  editProduct(product: any) {
    product.isEditing = true;
  }

  saveProduct(product: any) {
    product.isEditing = false;
    this.saveProductPositions(); 
  }

  deleteProduct(product: any) {
    this.products = this.products.filter(p => p.id !== product.id); 
    this.saveProductPositions(); 
  }

  addProduct(name: string, price: string, category: string) {
    const newProduct = {
      id: this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1, // Generate new ID
      name,
      price: parseFloat(price), 
      category,
      position: { left: Math.random() * (window.innerWidth - 200), top: Math.random() * (window.innerHeight - 250) },
      isEditing: false
    };
    this.products.push(newProduct); 
    this.saveProductPositions(); 
  }

  duplicateProduct(product: any) {
    const newProduct = {
      ...product,
      id: this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1, 
      position: { left: product.position.left + 20, top: product.position.top + 20 } 
    };
    this.products.push(newProduct);
    this.saveProductPositions();
  }
  
  onDragStart(event: DragEvent, product: any) {
    this.draggedProduct = product;
    event.dataTransfer?.setData('text/plain', JSON.stringify(product));
  }

  onDragEnd(event: DragEvent, product: any) {
    if (this.draggedProduct === product) {
      const newPosition = {
        left: event.clientX - (event.target as HTMLElement).offsetWidth / 2,
        top: event.clientY - (event.target as HTMLElement).offsetHeight / 2
      };
      product.position = newPosition;
      this.saveProductPositions(); 
    }
    this.draggedProduct = null;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault(); 
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
  }
}
