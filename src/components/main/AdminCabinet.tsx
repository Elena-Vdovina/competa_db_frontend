import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { selectUser } from '../../features/auth/selectors';
import { selectError, selectTasks } from '../../features/tasks/selectors';
import {
	createTask,
	deleteTask,
	loadAllEduLevel,
	resetError,
} from '../../features/tasks/tasksSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { TaskId } from '../../features/tasks/types/Task';

export default function AdminCabinet(): JSX.Element {
	const error = useAppSelector(selectError);
	const tasks = useAppSelector(selectTasks);
	const [name, setName] = useState<string>('');
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(loadAllEduLevel());
	}, [dispatch]);

	const handleSubmit = useCallback(
		async (event: React.FormEvent) => {
			event.preventDefault();
			const dispatchResult = await dispatch(createTask({ name }));
			if (createTask.fulfilled.match(dispatchResult)) {
				setName('');
			}
			if (createTask.fulfilled.match(dispatchResult)) {
				dispatch(resetError()); // чтобы после успешного создания - очишались ошибки
			}
		},
		[dispatch, name]
	);

	const handleTaskRemove = useCallback(
		(id: TaskId) => {
			dispatch(deleteTask(id));
		},
		[dispatch]
	);

	// ниже код для редиректа, если нет прав доступа
	const user = useAppSelector(selectUser);
	const navigate = useNavigate();
	// user // - что есть такой юзер
	// user && user.role === 'ADMIN' // - есть юзер и он админ
	// user && user.role === 'USER'  // - есть юзер и он пользователь по роли
	if (!user) {
		navigate('/');
	}

	return (
		<>
			<div>Администрирование справочников</div>
			<h3>EduLevel</h3>
			<h3>Добавить задачу</h3>
			<form className="mb-3" onSubmit={handleSubmit}>
				<div className="input-group">
					<input
						type="text"
						className={`form-control ${error ? 'is-invalid' : ''}`}
						placeholder="Задача..."
						aria-label="Задача..."
						name="taskTitle"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>

					<button type="submit" className="btn btn-primary">
						добавить
					</button>
				</div>
				{error && (
					<div className="invalid-feedback text-end" style={{ display: 'block' }}>
						{error}
					</div>
				)}
			</form>
			<ul>
				{tasks?.map((element) => (
					<li key={element.id}>
						{element.name}
						<span
							className="badge bg-danger rounded-pill remove-task"
							role="button"
							onClick={() => handleTaskRemove(element.id)}
							tabIndex={0}
						>
							удалить
						</span>
					</li>
				))}
			</ul>
		</>
	);
}
/*function useState<T>(arg0: string): [any] {
	throw new Error('Function not implemented.');
}
*/
