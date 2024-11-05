import http from './utilities/http';
import type { HttpErrors } from './types';
import html from './utilities/html';
import { showTasksPage } from './tasks';

const registerHtml = html`
    <div class="flex flex-col justify-center min-h-full px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:full-width sm:max-w-sm">
            <h2
                class="mt-10 text-2xl font-bold leading-9 tracking-tight text-center text-gray-900"
            >
                Create Your Account
            </h2>
        </div>

        <div class="text-left text-black mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form class="space-y-6" id="register-form" action="#" method="POST" novalidate>
                <div>
                    <label for="name" class="block text-sm font-medium leading-6 text-gray-900"
                        >Name</label
                    >
                    <div class="mt-2">
                        <input
                            id="name"
                            name="name"
                            type="name"
                            autocomplete="username"
                            class="block bg-white w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>

                <div>
                    <label
                        for="email"
                        class="block text-sm font-medium leading-6 text-gray-900"
                        >Email address</label
                    >
                    <div class="mt-2">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autocomplete="email"
                            class="block bg-white w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>

                <div>
                    <div class="flex items-center justify-between">
                        <label
                            for="password"
                            class="block text-sm font-medium leading-6 text-gray-900"
                            >Password</label
                        >
                        <div class="text-sm">
                            <a
                                href="#"
                                class="font-semibold text-indigo-600 hover:text-indigo-500"
                                >Forgot password?</a
                            >
                        </div>
                    </div>
                    <div class="mt-2">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autocomplete="new-password"
                            class="block bg-white w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Sign up
                    </button>
                </div>
            </form>
        </div>
    </div>
`;

const showRegisterPage = () => {
    document.querySelector('#main-content')!.innerHTML = registerHtml;

    const registerFormElement = document.querySelector('#register-form');

    registerFormElement?.addEventListener('submit', async event => {
        event.preventDefault();

        const name = document.querySelector<HTMLInputElement>('#name')?.value;
        const email = document.querySelector<HTMLInputElement>('#email')?.value;
        const password = document.querySelector<HTMLInputElement>('#password')?.value;

        try {
            await http.get('/sanctum/csrf-cookie');
            const response = await http.post('/api/register', { name, email, password });
            console.log(response);
            showLoginPage();
        } catch (errors: any) {
            console.log(errors);
            if (errors.response.status === 422) {
                clearErrors();
                renderErrors(errors.response.data.errors);
            }
        }
    });
};

const loginFormHtml = html`<div
    class="flex flex-col justify-center min-h-full px-6 py-12 lg:px-8"
>
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2
            class="mt-10 text-2xl font-bold leading-9 tracking-tight text-center text-gray-900"
        >
            Sign into your account
        </h2>
    </div>

    <div class="text-left mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form class="space-y-6" id="login-form" action="#" method="POST" novalidate>
            <div>
                <label for="email" class="block text-sm font-medium leading-6 text-gray-900">
                    Email address
                </label>
                <div class="mt-2">
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autocomplete="email"
                        class="bg-white block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                </div>
            </div>

            <div>
                <div class="flex items-center justify-between">
                    <label
                        for="password"
                        class="block text-sm font-medium leading-6 text-gray-900"
                    >
                        Password
                    </label>
                    <div class="text-sm">
                        <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500"
                            >Forgot password?</a
                        >
                    </div>
                </div>
                <div class="mt-2">
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autocomplete="current-password"
                        class="bg-white block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                </div>
            </div>

            <div>
                <button
                    type="submit"
                    class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Sign in
                </button>
            </div>
        </form>
    </div>
</div>`;

export const showLoginPage = () => {
    document.querySelector('#main-content')!.innerHTML = loginFormHtml;

    const loginFormElement = document.querySelector('#login-form');

    loginFormElement?.addEventListener('submit', async event => {
        event.preventDefault();
        clearErrors();

        const email = document.querySelector<HTMLInputElement>('#email')?.value;
        const password = document.querySelector<HTMLInputElement>('#password')?.value;

        try {
            await http.get('/sanctum/csrf-cookie');
            const response = await http.post('/api/login', { email, password });
            showTasksPage();
            console.log(response);
        } catch (errors: any) {
            console.log(errors);
            if (errors.response.status === 422) {
                renderErrors(errors.response.data.errors);
            }
        }
    });
};

const clearErrors = () => {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => element.remove());
};

const renderErrors = (errors: HttpErrors) => {
    for (let fieldName in errors) {
        const error = errors[fieldName];

        const errorElement = render(html`<output
            class="error-message block mt-2 py-4 text-red-800 border border-red-700 rounded-md bg-red-50 px-7"
        >
            ${error}
        </output>`);

        const inputField = document.querySelector(`#${fieldName}`);
        const formGroup = inputField?.parentElement?.parentElement;

        formGroup?.appendChild(errorElement);
    }
};

const render = (html: string) => {
    const template = document.createElement('template');
    template.innerHTML = html;
    return template.content;
};

export { showRegisterPage };
