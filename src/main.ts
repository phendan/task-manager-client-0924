import './style.css';

import { showRegisterPage, showLoginPage } from './auth';
import { showTasksPage } from './tasks';

const routes = {
    register: showRegisterPage,
    login: showLoginPage,
    tasks: showTasksPage
};

type Route = keyof typeof routes;

showRegisterPage();

const navLinks = document.querySelectorAll<HTMLAnchorElement>('.nav-links a');

navLinks?.forEach(link => {
    link.addEventListener('click', event => {
        event.preventDefault();

        const page = link.getAttribute('href');
        if (!page) return;

        if (routes.hasOwnProperty(page)) {
            routes[page as Route]();
        }
    });
});
