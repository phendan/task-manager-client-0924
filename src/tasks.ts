import { showLoginPage } from './auth';
import { Task } from './types';
import html from './utilities/html';
import http from './utilities/http';
import { fetchUser, logout } from './utilities/user';

const tasksFormHtml = html`
    <form id="task-form">
        <div class="relative py-1">
            <input
                id="task"
                autofocus
                class="bg-white block w-full py-2 transition duration-150 ease-in-out border-2 border-transparent focus focus:shadow-none focus:border-blue-300 form-input"
                placeholder="New Task..."
            />
            <div class="absolute inset-y-0 right-0 flex py-1">
                <button
                    type="submit"
                    class="items-center px-4 text-sm text-gray-700 bg-gray-300 hover:text-gray-400"
                >
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                        ></path>
                    </svg>
                </button>
            </div>
        </div>
    </form>
`;

export const showTasksPage = async () => {
    const user = await fetchUser();

    if (!user) {
        showLoginPage();
        return;
    }

    const tasks = user.tasks;

    const toDos = tasks.filter(task => task.status === 'to-do');
    const toDosHtml = renderTasks(toDos);

    const inProgress = tasks.filter(task => task.status === 'in-progress');
    const inProgressHtml = renderTasks(inProgress);

    const done = tasks.filter(task => task.status === 'done');
    const doneHtml = renderTasks(done);

    const tasksHtml = html` <div>
        <div>
            Welcome, ${user.name}! <button id="logout" class="bg-gray-300">Logout</button>
        </div>
        <!-- Task List -->
        ${tasksFormHtml}
        <div>
            <h2 class="text-lg font-bold">To-Dos</h2>
            ${toDosHtml}
        </div>

        <div>
            <h2 class="text-lg font-bold">In Progress</h2>
            ${inProgressHtml}
        </div>

        <div>
            <h2 class="text-lg font-bold">Done</h2>
            ${doneHtml}
        </div>
    </div>`;

    document.querySelector('#main-content')!.innerHTML = tasksHtml;

    const dropdowns = document.querySelectorAll<HTMLSelectElement>('.change-status-dropdown');

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('change', async event => {
            const status = dropdown.selectedOptions[0].value;
            const taskId = dropdown.dataset.taskId;

            try {
                await http.get('/sanctum/csrf-cookie');
                const response = await http.patch(`/api/task/${taskId}`, { status });
                console.log(response);
            } catch (errors) {
            } finally {
                showTasksPage();
            }
        });
    });

    const taskForm = document.querySelector('#task-form');
    taskForm?.addEventListener('submit', async event => {
        event.preventDefault();

        const inputElement = document.querySelector<HTMLInputElement>('#task');
        const taskTitle = inputElement?.value;

        try {
            await http.get('/sanctum/csrf-cookie');
            const response = await http.post('/api/task', {
                title: taskTitle,
                status: 'to-do'
            });
            inputElement!.value = '';
            showTasksPage();
        } catch {
            //
        }
    });

    const logoutButton = document.querySelector('#logout');
    logoutButton?.addEventListener('click', async event => {
        event.preventDefault();
        await logout();
        showLoginPage();
    });
};

const renderTasks = (tasks: Task[]) => {
    const taskElements = tasks
        .map(task => {
            const selectHtml = renderSelect(task);

            return html`<li class="flex items-center justify-between py-2">
                <div>${task.title}</div>
                <!-- Change Status -->
                ${selectHtml}
            </li>`;
        })
        .join('');

    const taskList = html`
        <ul class="divide-y divide-gray-100">
            ${taskElements}
        </ul>
    `;

    return taskList;
};

const renderSelect = (task: Task) => {
    const statuses = ['to-do', 'in-progress', 'done'];

    const selectHtml = html`<select
        class="change-status-dropdown bg-white"
        data-task-id="${task.id}"
    >
        ${statuses.map(status => {
            return html`<option value="${status}" ${task.status === status ? 'selected' : ''}>
                ${status}
            </option>`;
        })}
    </select>`;

    return selectHtml;
};
