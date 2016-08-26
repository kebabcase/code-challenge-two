(() => {
  'use strict';

  function TodoController($scope, Todo, DS, LoopBackAuth) {
    class Controller {
      constructor() {
        this.$scope = $scope;
        this.Todo = Todo;
        this.DS = DS;

        this.resetTodo();
        this.viewFinished = false;

        // Add Todo Data Stream to Model
        this.todoList = this.DS.link($scope, 'Todo', 'todos');
      }

      $onDestroy() {
        this.todoList.discard();

        if (this.todoList.isEmpty()) {
          this.todoList.delete();
        }
      }

      /////////////////
      ///// Page Actions
      /////////////////

      createTodo() {
        this.resetTodo();

        if (!this.modal) {
          this.modal = $('.modal');
          this.modal.leanModal();
        }

        this.modal.openModal();

        this.modal.find('#title').focus();
      }

      ok() {
        if (!this.validateTodo(this.newTodo)) {
          this.close();
          return;
        }

        const name = this.getTodoName(this.newTodo.id);

        this.DS.getRecord(name).set(this.newTodo);
        this.todoList.addEntry(name);

        this.cancel();
      }

      cancel() {
        this.modal.closeModal();
      }

      deleteTodo(todo) {
        if (todo && todo.id) {
          this.todoList.removeEntry(this.getTodoName(todo.id));
        }
      }

      markAsDone(todo) {
        todo.finished = true;
      }

      markAsTodo(todo) {
        todo.finished = false;
      }

      /////////////////
      ///// Required Functions
      /////////////////

      getTodoName(id) {
        return `Todo/${id}`;
      }

      validateTodo(todo) {
        return todo.title.length >= 1;
      }

      resetTodo() {
        this.newTodo = {
          id: this.DS.source.getUid(),
          title: '',
          text: '',
          createdOn: (new Date()).toString(),
          finished: false
        };
      }
    }

    return new Controller();
  }

  TodoController.$inject = ['$scope', 'Todo', 'DS', 'LoopBackAuth'];

  angular.module('app')
    .controller('TodoController', TodoController);
})();
