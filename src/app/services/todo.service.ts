import { Injectable } from '@angular/core';
import {Todo} from '../models/todo.model';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/throw';
import {Http, Response} from '@angular/http';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {SmartsheetConfig} from '../../smartsheet.config';

const SHEET_URL = `${SmartsheetConfig.smartsheetUrl}/sheets/${SmartsheetConfig.sheetId}`;

@Injectable()
export class TodoService {
  private todos: BehaviorSubject<Array<Todo>> = null;

  categories: Todo[] = [];

  constructor(private http: Http) {
      this.todos = new BehaviorSubject(null);
      this.http.get(`${SHEET_URL}`) /* -> result */
      /* result -> */    .map(this.extractData) /* -> Json */
      /* Json -> */      .map(this.fromJson) /* -> Array<Todo> */ 
                         .catch((res: Response) => this.handleError(res))
      /* Array<Todo> -> */    .subscribe(todos => this.todos.next(todos));
  }

  displayIt() {
    var temp = document.getElementsByTagName("template")[0];
    var clon = temp.content.cloneNode(true);
    document.body.appendChild(clon);
  }
  createCategories() {
    
    // let categories = this.todos;
      // let lastParentNode;
      // let categoryNum = 1;
      // todos.forEach(function(todo) {
      //   console.log('THE', todo);
      //   this.categories.push(todo);
        // console.log('todo single', todo);
          // if (!todo.parentId) {
          //     if (lastParentNode) {
                  
          //         //all.push(lastParentNode);
          //         if (!lastParentNode.isRowCategory) {
          //             lastParentNode.category = 0;
          //         }
          //         lastParentNode = '';
          //     }
          //     if (todo.name) {
          //         lastParentNode = todo;
          //     }
          // } else if (lastParentNode) {

          //     if (todo.parentId === lastParentNode.id) {
                
          //         todo.category = lastParentNode.category;
          //         if (!lastParentNode.isRowCategory) {
          //             lastParentNode.isRowCategory = true;
          //             lastParentNode.category = categoryNum;
          //             categories.push(lastParentNode);
          //             categoryNum++;
          //         }
          //         //lastParentNode = '';
          //     } else {
          //         //all.push(lastParentNode);
          //         // lastParentNode = '';
          //     }
          // }
      // })
      // console.log('in cats', this.categories);

      //this.TodoService.categories = categories;
  }

  getTodos(): Observable<Array<Todo>> {
      return this.todos;
  }

  deleteTodo(todoToDelete: Todo) {
     this.deleteTodos([todoToDelete.rowId]);
  }

  deleteTodos(todoIds: Array<number>) {
      const todosToDelete = todoIds.join();

      this.http.delete(`${SHEET_URL}/rows?ids=${todosToDelete}`)
          .map(this.extractData)
          .catch((res: Response) => this.handleError(res))
          .subscribe(deletedTodos => {
              let remainingTodos;
              this.todos.subscribe(todos => remainingTodos = todos.filter(todo => !deletedTodos.includes(todo.rowId)));
              if (remainingTodos) {
                  this.todos.next(remainingTodos);
              }
          });
  }

  addTodo(newTodoTitle: string) {
      const newTodoJson = this.toNewTodoJson(newTodoTitle);
      this.http.post(`${SHEET_URL}/rows`, JSON.stringify(newTodoJson))
          .map(this.extractData)
          .map(this.fromJson)
          .catch((res: Response) => this.handleError(res))
          .subscribe(newTodo => {
              let todos;
              this.todos.subscribe(todosSub => todos = todosSub);
              if (todos) {
                  todos.push(newTodo[0]);
                  this.todos.next(todos);
              }
          });
  }

  updateTodo(todoToUpdate: Todo): Observable<Array<Todo>> {
      this.http.put(`${SHEET_URL}/rows`, this.toUpdateTodoJson(todoToUpdate))
          .map(this.extractData)
          .map(this.fromJson)
          .catch((res: Response) => this.handleError(res))
          .subscribe(newTodo => {
              let todos;
              this.todos.subscribe(todosSub => {
                  todos = todosSub.filter(todo => todo.rowId !== newTodo[0].rowId);
              });
              if (todos) {
                  todos.push(newTodo[0]);
                  this.todos.next(todos);
              }
          });
      return this.todos;
  }

  private extractData(res: Response) {
      const body = res.json();
      return (body) ? body.result || body : {};
  }

  private fromJson(json: any): Array<Todo> {
      console.log('JSON HERE', json);
      const todos = new Array<Todo>();
      let rows = null;

      if (json.rows) {
          rows = json.rows;
      } else {
          if (json instanceof Array) {
              rows = json;
          } else {
              rows = [json];
          }
      }

      rows.forEach(row => {
          const todo = new Todo(row.id, row.rowNumber, row.dueDate);
          if (row.parentId) {
            todo.parentId = row.parentId;
          }
          row.cells.forEach(cell => {
              switch (cell.columnId) {
                  case SmartsheetConfig.taskNameColumnId:
                      todo.name = cell.value;
                      break;
                  case SmartsheetConfig.dueDateColumnId:
                      todo.dueDate = cell.value;
                      break;
                  case SmartsheetConfig.doneColumnId:
                      todo.done = cell.value ? cell.value : false;
              }
          });

          if (todo.name) {
            todos.push(todo);
          }
      });
      return todos;
  }

  private toNewTodoJson(newTodoTitle: string) {
      return {
          toBottom: true,
          cells: [
              {columnId:  SmartsheetConfig.taskNameColumnId, value: newTodoTitle}
          ]
      };
  }

  private toUpdateTodoJson(todo: Todo) {
      return {
          id: todo.rowId,
          cells: [
              {
                  columnId: SmartsheetConfig.taskNameColumnId,
                  value: todo.name
              },
              {
                  columnId: SmartsheetConfig.doneColumnId,
                  value: todo.done
              },
              {
                  columnId: SmartsheetConfig.dueDateColumnId,
                  value: todo.dueDate
              }
          ]
      };
  }

  private handleError(error: Response | any) {
      // In a real world app, you might use a remote logging infrastructure
      let errMsg: string;
      if (error instanceof Response) {
          const body = error.json() || '';
          const err = body.error || JSON.stringify(body);
          errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
      } else {
          errMsg = error.message ? error.message : error.toString();
      }
      console.error(errMsg);
      return Observable.throw(errMsg);
  }

  // Simulate POST /todos
  // addTodo(todo: Todo): TodoService {
  //   if (!todo.id) {
  //     todo.id = ++this.lastId;
  //   }
  //   this.todos.push(todo);
  //   return this;
  // }

  // Simulate DELETE /todos/:id
  // deleteTodoById(id: number): TodoService {
  //   this.todos = this.todos
  //     .filter(todo => todo.id !== id);
  //   return this;
  // }

  // Simulate PUT /todos/:id
  // updateTodoById(id: number, values: Object = {}): Todo {
  //   const todo = this.getTodoById(id);
  //   if (!todo) {
  //     return null;
  //   }
  //   Object.assign(todo, values);
  //   return todo;
  // }

  // Simulate GET /todos
  // getAllTodos(): Todo[] {
  //   return this.todos;
  // }

  // Simulate GET /todos/:id
  // getTodoById(id: number): Todo {
  //   return this.todos
  //     .filter(todo => todo.id === id)
  //     .pop();
  // }

  // Simulate GET /todos/:category
  // getTodoByCategory(id: number): Todo[] {
  //   return this.todos
  //     .filter(todo => todo.category === id);
  // }

  // Toggle todo complete
  // toggleTodoComplete(todo: Todo) {
  //   const updatedTodo = this.updateTodoById(todo.id, {
  //     complete: !todo.complete
  //   });
  //   return updatedTodo;
  // }

  // Simulate POST /categories
  // addCategory(category: Category): CategoryService {
  //   if (!category.id) {
  //     category.id = ++this.lastId;
  //   }
  //   this.categories.push(category);
  //   return this;
  // }

  // Simulate DELETE /categories/:id
  // deleteCategoryById(id: number): CategoryService {
  //   this.categories = this.categories
  //     .filter(category => category.id !== id);
  //   return this;
  // }

  // Simulate PUT /categories/:id
  // updateCategoryById(id: number, values: Object = {}): Category {
  //   let category = this.getCategoryById(id);
  //   if (!category) {
  //     return null;
  //   }
  //   Object.assign(category, values);
  //   return category;
  // }

  // Simulate GET /categories
  // getAllCategories(): Todo[] {
  //   return this.categories;
  // }

  // // Simulate GET /categories/:id
  // getCategoryById(id: number): Category {
  //   return this.categories
  //     .filter(category => category.id === id)
  //     .pop();
  // }
}