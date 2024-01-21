import { DAY_IN_WEEK } from "./constant";
import { getNumOfDayInMonth } from "./utils";

export type StateType = {
	shownCalendar: Date;
	selectedDate: Date;
	todoData: any;
};

// DOM
const calendarDay = document.querySelector(".calendar-day") as HTMLDivElement;
const calendarTitle = document.querySelector(
	".calendar-title span"
) as HTMLSpanElement;
const calendar = document.querySelector(".calendar") as HTMLDivElement;
const todoInput = document.querySelector(".newTodo") as HTMLInputElement;
const todoList = document.querySelector(".todo-list") as HTMLDivElement;

// Store
const store = (initialState: StateType) => {
	let storedVal: StateType = { ...initialState };

	const setState = (val: StateType) => {
		storedVal = { ...val };
		render();
	};

	const state = () => {
		return storedVal;
	};

	return {
		state,
		setState,
	};
};

const { state, setState } = store({
	shownCalendar: new Date(),
	selectedDate: new Date(),
	todoData: {},
});

// Renderer
const renderCalendar = () => {
	calendarTitle.innerHTML = `${state().shownCalendar.toLocaleString(
		"default",
		{ month: "long" }
	)} ${state().shownCalendar.getFullYear()}`;

	calendarDay.innerHTML = "";
	DAY_IN_WEEK.map((val) => {
		const day = document.createElement("p") as HTMLParagraphElement;
		day.innerText = val;
		calendarDay.appendChild(day);
	});

	const numOfDayInMonth = getNumOfDayInMonth(state().selectedDate);
	const selectedDate = state().selectedDate.getDate();
	const firstDayOfMonth = new Date(
		`${state().shownCalendar.getFullYear()}-${
			state().shownCalendar.getMonth() + 1
		}-01`
	).getDay();

	calendar.innerHTML = "";
	Array(numOfDayInMonth + Number(firstDayOfMonth))
		.fill(0)
		.map((_, index) => {
			const calendarDate = document.createElement("p");
			calendarDate.innerText =
				index >= Number(firstDayOfMonth)
					? String(index + 1 - Number(firstDayOfMonth))
					: "";
			if (selectedDate === index) {
				calendarDate.setAttribute("class", "selected");
			}

			calendarDate.setAttribute(
				"onclick",
				`updateSelectedDate(${index + 1 - firstDayOfMonth})`
			);
			calendar.appendChild(calendarDate);
		});
};

const renderEditor = () => {
	todoList.innerHTML = "";

	const data = state().todoData[state().selectedDate.toISOString()] ?? [];
	const todos = document.createElement("ul");

	data.map((val: string) => {
		console.log(val);
		const task = document.createElement("li");
		task.innerHTML = val;
		todos.appendChild(task);
	});
	todoList.appendChild(todos);
};

const render = () => {
	renderCalendar();
	renderEditor();
};

render();

// Utils
(window as any).nextMonth = () => {
	setState({
		...state(),
		shownCalendar: new Date(
			state().selectedDate.setMonth(state().selectedDate.getMonth() + 1)
		),
	});
};

(window as any).prevMonth = () => {
	setState({
		...state(),
		shownCalendar: new Date(
			state().selectedDate.setMonth(state().selectedDate.getMonth() - 1)
		),
	});
};

(window as any).updateSelectedDate = (date: number) => {
	const updatedDate = new Date(state().selectedDate);
	updatedDate.setDate(date);
	setState({
		...state(),
		selectedDate: updatedDate,
	});
};

(window as any).addTodo = () => {
	let newTodoData: any = {
		...state().todoData,
	};

	if (!newTodoData[state().selectedDate.toISOString()]) {
		newTodoData[state().selectedDate.toISOString()] = [];
	}

	newTodoData[state().selectedDate.toISOString()].push(todoInput.value);
	todoInput.value = "";

	localStorage.setItem("todos", JSON.stringify(newTodoData));
	setState({
		...state(),
		todoData: newTodoData,
	});
};
