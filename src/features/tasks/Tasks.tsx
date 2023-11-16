import { useCallback, useEffect, useState } from 'react';
import { selectError, selectTasks } from './selectors';
import { createTask, loadTasks, resetError } from './tasksSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectUser } from '../auth/selectors';
import { useNavigate } from 'react-router-dom';

export default function Tasks(): JSX.Element {
	const error = useAppSelector(selectError);
	const tasks = useAppSelector(selectTasks);
	const [name, setName] = useState<string>('');
	const dispatch = useAppDispatch();

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

	useEffect(() => {
		dispatch(loadTasks());
	}, [dispatch]);

	// ниже код для редиректа, если нет прав доступа
	const user = useAppSelector(selectUser);
	const navigate = useNavigate();
	// user // - что есть такой юзер
	// user && user.role === 'ADMIN' // - есть юзер и он админ
	// user && user.role === 'USER'  // - есть юзер и он пользователь по роли
	if (user) {
		navigate('/');
	}
	return (
		<>
			<div>Tasks</div>
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
			<h3>Задачи текущего юзера</h3>
			<ul>
				{tasks?.map((element) => (
					<li key={element.id}>{element.name}</li>
				))}
			</ul>
		</>
	);
}
