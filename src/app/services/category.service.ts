// import { Injectable } from '@angular/core';
// import {Category} from '../models/category.model';
// import {Todo} from '../models/todo.model';
// import {Observable} from 'rxjs/Observable';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/operator/do';
// import 'rxjs/add/observable/throw';
// import {Http, Response} from '@angular/http';
// import {BehaviorSubject} from 'rxjs/BehaviorSubject';
// import {SmartsheetConfig} from '../../smartsheet.config';

// const SHEET_URL = `${SmartsheetConfig.smartsheetUrl}/sheets/${SmartsheetConfig.sheetId}`;

// @Injectable()
// export class CategoryService {

//   // Placeholder for last id so we can simulate
//   // automatic incrementing of id's
//   // lastId = 0;

//     // Placeholder for category's
//     categories: Todo[] = ['hi'];

//   constructor() { }

//   // Simulate POST /categories
//   addCategory(category: Category): CategoryService {
//     if (!category.id) {
//       category.id = ++this.lastId;
//     }
//     this.categories.push(category);
//     return this;
//   }

//   // Simulate DELETE /categories/:id
//   deleteCategoryById(id: number): CategoryService {
//     this.categories = this.categories
//       .filter(category => category.id !== id);
//     return this;
//   }

//   // Simulate PUT /categories/:id
//   updateCategoryById(id: number, values: Object = {}): Category {
//     let category = this.getCategoryById(id);
//     if (!category) {
//       return null;
//     }
//     Object.assign(category, values);
//     return category;
//   }

//   // Simulate GET /categories
//   getAllCategories(): Todo[] {
//     return this.categories;
//   }

//   // Simulate GET /categories/:id
//   getCategoryById(id: number): Category {
//     return this.categories
//       .filter(category => category.id === id)
//       .pop();
//   }


// }