import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import jsonData from './data/data.json';
import subproductsData from './data/sub-products.json'
import {CdkDragDrop, CdkDrag, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, CdkDropList, CdkDrag],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'demo-app';

  products: any[] = jsonData.products;
  subProducts : any[] = subproductsData.subProducts;

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
  
    drop(event: CdkDragDrop<string[]>) {
      moveItemInArray(this.products, event.previousIndex, event.currentIndex);
    }

    nestedDrop(event: CdkDragDrop<string[]>) {
      moveItemInArray(this.subProducts, event.previousIndex, event.currentIndex);
    }



    saveProductPositions() {
      localStorage.setItem('products', JSON.stringify(this.products));
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
        position: { left: Math.random() * (window.innerWidth - 200), top: Math.random() * (window.innerHeight - 250) } 
      };
      this.products.push(newProduct);
      this.saveProductPositions();
    }
  
}
