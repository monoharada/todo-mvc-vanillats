import { delegate, escapeForHTML, getURLHash } from "./helper";
import { TodoStore } from "./store";

(function (window) {
	"use strict";
	const App = {
		$: {
			input: document.querySelector<HTMLInputElement>(".new-todo"),
			list: document.querySelector(".todo-list"),
			count: document.querySelector(".todo-count strong"),
			footer: document.querySelector<HTMLElement>(".footer"),
			toggleAll: document.querySelector<HTMLInputElement>(".toggle-all"),
			main: document.querySelector<HTMLElement>(".main"),
			clear: document.querySelector<HTMLElement>(".clear-completed"),
			filters: document.querySelector(".filters"),
		},
		filter: getURLHash(),
		_init: function () {
			TodoStore._init();
			window.addEventListener("hashChange", () => {
				App.filter = getURLHash();
				App.render();
			});
			App.$.input.addEventListener("keyup", (e) => {
				if (e.keyCode === 13) {
					App.addTodo(e.target.value);
					App.$.input.value = "";
				}
			});
			App.$.toggleAll.addEventListener("click", (e) => {
				TodoStore.toggleAll();
				App.render();
			});
			App.$.clear.addEventListener("click", (e) => {
				TodoStore.clearCompleted();
				App.render();
			});
			App.render();
		},
		showFilteredTodos: function () {
			App.render();
		},
		addTodo: function (todo) {
			TodoStore.add({ title: todo, completed: false, id: "id_" + Date.now() });
			App.render();
		},
		removeTodo: function (todo) {
			TodoStore.remove(todo);
			App.render();
		},
		toggleTodo: function (todo) {
			TodoStore.toggle(todo);
			App.render();
		},
		createTodoItem: function (todo) {
			const li = document.createElement("li");
			if (todo.completed) {
				li.classList.add("completed");
			}

			li.innerHTML = /*HTML*/ `
			<div class='view'>
				<input type="checkbox" class="toggle" ${todo.completed ? "checked" : ""}>
				<label>${escapeForHTML(todo.title)}</label>
				<button class="destroy"></button>
			</div>`;

			delegate(li, "click", ".destroy", App.removeTodo, todo);
			delegate(li, "click", ".toggle", App.toggleTodo, todo);

			return li;
		},
		render: function () {
			const todos = TodoStore.all(App.filter);
			const todosCount = TodoStore.all().length;
			App.$.filters
				.querySelectorAll("a")
				.forEach((el) => el.classList.remove("selected"));
			App.$.filters
				.querySelector(`[href="#/${App.filter}"]`)
				.classList.add("selected");
			App.$.list.innerHTML = "";
			todos.forEach((todo) => {
				App.$.list.appendChild(App.createTodoItem(todo));
			});
			App.$.footer.style.display = todosCount ? "block" : "none";
			App.$.main.style.display = todosCount ? "block" : "none";
			App.$.clear.style.display = TodoStore.hasCompleted() ? "block" : "none";
			App.$.toggleAll.checked =
				todosCount && todos.every((todo) => todo.completed);
			App.$.count.innerHTML = TodoStore.all("active").length;
		},
	};
	App._init();

	window.TodoApp = App;
})(window);
