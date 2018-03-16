import { Component, OnInit } from '@angular/core';
import { Todo } from '../models/todo.model';
import { TodoService } from '../services/todo.service';
// import { Category } from '../models/category.model';

@Component({
    selector: 'app-todo',
    templateUrl: 'todo.component.html',
    styleUrls: ['todo.component.css']
})

export class TodoComponent {
    newTodoText = '';
    public todos: Array<Todo>;
    // public categories: Array<Todo>;
    // newCategory: Category = new Category();
    // selectedCategory: Category;


    constructor(private todoService: TodoService) {
        todoService.getTodos()
            .subscribe(todos => { if (todos) {this.todos = todos.sort((a, b) => a.ordinal - b.ordinal); }});
        // this.categories = todoService.getAllCategories();
    }

    test() {
        console.log(this.todos)
    }
    stopEditing(todo: Todo, editedTitle: string) {
        todo.name = editedTitle;
        todo.editing = false;
    }

    cancelEditingTodo(todo: Todo) {
        todo.editing = false;
    }

    updateEditingTodo(editedTodo: Todo, editedTitle: string) {
        editedTitle = editedTitle.trim();
        editedTodo.editing = false;

        if (editedTitle.length === 0) {
            return this.todoService.deleteTodo(editedTodo);
        }
        editedTodo.name = editedTitle;
        this.todoService.updateTodo(this.todos.find(todo => todo.rowId === editedTodo.rowId));
    }

    editTodo(todo: Todo) {
        todo.editing = true;
    }

    toggleCompletion(todo: Todo) {
        todo.done = !todo.done;
        this.todoService.updateTodo(todo);
    }

    remove(todo: Todo) {
        this.todoService.deleteTodo(todo);
    }

    addTodo() {
        if (this.newTodoText.trim().length) {
            this.todoService.addTodo(this.newTodoText);
            this.newTodoText = '';
            // this.newTodo.category = this.selectedCategory.id;
        }
    }

    removeCompleted() {
        const todosToDelete = new Array<number>();

        this.todos.filter(todo => {
            if (todo.done) {
                return true;
            }}).map(todo => todosToDelete.push(todo.rowId));

        this.todoService.deleteTodos(todosToDelete);
    }

  // addTodo() {
  //   this.newTodo.category = this.selectedCategory.id;
  //   this.todoService.addTodo(this.newTodo);
  //   this.newTodo = new Todo();
  //   console.log(this.todos);
  // }

  // toggleTodoComplete(todo) {
  //   this.todoService.toggleTodoComplete(todo);
  // }

  // removeTodo(todo) {
  //   this.todoService.deleteTodoById(todo.id);
  // }

  // get todos() {
  //   return this.todoService.getAllTodos();
  // }

  // get todosForCat() {
  //   return this.todoService.getTodoByCategory(this.selectedCategory.id);
  // }

  //combine this with todosForCat()?
  // countTodosByCat(id: number) {
  //   return this.todoService.getTodoByCategory(id).length;
  // }

  // addCategory() {
  //   this.categoryService.addCategory(this.newCategory);
  //   this.newCategory = new Category();
  // }

  // removeCategory(category) {
  //   this.categoryService.deleteCategoryById(category.id);
  // }

  // get categories() {
  //   return this.categoryService.getAllCategories();
  // }

  // categoryById(id: number) {
  //   return this.categoryService.getCategoryById(id);
  // }

  // addInitialCategory(category) {
  //   this.categoryService.addCategory(category);
  // }

  // addInitialTodo(todo) {
  //   this.todoService.addTodo(todo);
  // }


  // onSelect(category: Category): void {
  //   this.selectedCategory = category;
  // }

  // ngOnInit() {
  //   let initCat = new Category();
  //   initCat = {'name' : 'Today', 'id' : null , };
  //   this.addInitialCategory(initCat);
  //   initCat = {'name' : 'Tomorrow', 'id' : null , };
  //   this.addInitialCategory(initCat);
  //   initCat = {'name' : 'Work', 'id' : null , };
  //   this.addInitialCategory(initCat);
  //   initCat = {'name' : 'Holidays', 'id' : null , };
  //   this.addInitialCategory(initCat);
  //   initCat = {'name' : 'Shopping list', 'id' : null , };
  //   this.addInitialCategory(initCat);

  //   let initTodo = new Todo();
  //   initTodo = {'title' : 'Task1', 'complete': false, 'id' : null , category: 1 };
  //   this.addInitialTodo(initTodo);
  //   initTodo = {'title' : 'Task2', 'complete': true, 'id' : null , category: 2 };
  //   this.addInitialTodo(initTodo);
  //   initTodo = {'title' : 'Task3', 'complete': true, 'id' : null , category: 1 };
  //   this.addInitialTodo(initTodo);
  // }
}