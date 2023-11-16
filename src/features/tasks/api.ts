import Task, { TaskId } from './types/Task';
// все запросы на сервер касательно тасков объединены в этом файлике
// в остальной программе, мы будем делать запросы только опосредованно через api
// запрос на создание таска
export async function createTask(name: string): Promise<Task> {
	const res = await fetch('/api/edulevel', {
		method: 'POST',
		body: JSON.stringify({ name }),
		headers: {
			'Content-Type': 'application/json',
		},
	});

	interface Error {
		message: string;
		field: string;
		rejectedValue: string;
	}
	if (res.status >= 400) {
		const { errors }: { errors: Error[] } = await res.json();
		errors.forEach((err) => {
			throw new Error(`${err.field} ${err.rejectedValue} ${err.message}`);
		});
	}

	return res.json();
}
// пример запроса на обновление таска
export async function updateTask(task: Task): Promise<void> {
	await fetch(`/api/edulevel/${task.id}`, {
		method: 'PUT',
		body: JSON.stringify(task),
		headers: {
			'Content-Type': 'application/json',
		},
	});
}
// на удаление права только у админа
export async function deleteTask(id: TaskId): Promise<void> {
	await fetch(`/api/edulevel/${id}`, {
		method: 'DELETE',
	});
}

// доступ у юзера - таски текущего пользователя
export async function getTasks(): Promise<{ tasks: Task[] }> {
	const result = await fetch('/api/edulevel/all');
	return result.json();
}

// доступ только у админа - получение с сервера всех записей справочника EduLevel
export async function getAllEduLevel(): Promise<{ tasks: Task[] }> {
	const result = await fetch('/api/edulevel/all');
	return result.json();
}
