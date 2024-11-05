export type HttpErrors = Record<string, string[]>;

export type User = {
    id: number;
    name: string;
    email: string;
    updated_at: string;
    created_at: string;
    tasks: Task[];
};

export type Task = {
    id: number;
    title: string;
    status: 'to-do' | 'in-progress' | 'done';
    user_id: User['id'];
    created_at: string;
    updated_at: string;
};
