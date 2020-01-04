export interface Tasks {
    title: string;
    id: string;
    tasks: Task[];
}
export interface Task {
    id: string;
    title: string;
    description: string;
}