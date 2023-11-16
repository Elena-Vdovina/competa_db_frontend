export default interface Task {
	id: number;
	name: string;
}

export type TaskId = Task['id'];
