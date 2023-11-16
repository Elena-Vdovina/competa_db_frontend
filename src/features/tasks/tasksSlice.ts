// tasks/tasksSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import { logout } from '../auth/authSlice';
// import Task, { TaskId } from './types/Task';
import TasksState from './types/TasksState';
import * as api from './api';
import { TaskId } from './types/Task';

const initialState: TasksState = {
	tasks: [],
	error: undefined,
};

export const createTask = createAsyncThunk(
	'tasks/createTask',
	async ({ name }: { name: string }) => {
		// проверка фронта - закоментирована, чтобы мы могли наслаждаться сообщения с проверок бэка

		// if (!name.trim() || !description.trim()) {
		// 	throw new Error('Заголовок задачи и описание не должны быть пустыми');
		// }
		return api.createTask(name);
	}
);
// обращается к api для загрузки тасков пользователя
export const loadTasks = createAsyncThunk('tasks/loadTasks', () => api.getTasks());
// обращается к api для загрузки всех записей справочника EduLevel
export const loadAllEduLevel = createAsyncThunk('tasks/loadAllEduLevel', () =>
	api.getAllEduLevel()
);

// export const updateTask = createAsyncThunk(
//   'tasks/updateTask',
//   async (newTask: Task) => {
//     await api.updateTask(newTask);
//     return newTask;
//   }
// );

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id: TaskId) => {
	await api.deleteTask(id);
	return id;
});

const tasksSlice = createSlice({
	name: 'tasks',
	initialState,
	reducers: {
		resetError: (state) => {
			state.error = undefined;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(createTask.rejected, (state, action) => {
				state.error = action.error.message;
			})
			.addCase(createTask.fulfilled, (state, action) => {
				state.tasks.push(action.payload);
			})
			.addCase(loadTasks.fulfilled, (state, action) => {              // v Tasks
				state.tasks = action.payload.tasks;
			})
			.addCase(loadAllEduLevel.fulfilled, (state, action) => {				// v AdminCabinet
				state.tasks = action.payload;
			})

			// .addCase(updateTask.fulfilled, (state, action) => {
			//   state.tasks = state.tasks.map((task) =>
			//     task.id === action.payload.id ? action.payload : task
			//   );
			// })

			.addCase(deleteTask.fulfilled, (state, action) => {
				state.tasks = state.tasks.filter((task) => task.id !== action.payload);
			});

		// .addCase(logout.fulfilled, (state) => {
		//   state.tasks = [];
		// });
	},
});

export const { resetError } = tasksSlice.actions;

export default tasksSlice.reducer;
