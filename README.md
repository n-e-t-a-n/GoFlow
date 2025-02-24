# GoFLow

![Last Update](https://img.shields.io/github/last-commit/n-e-t-a-n/GoFlow?color=blue&label=Last%20Update)

![Activity](https://img.shields.io/badge/Activity-Completed-blue)

GoFlow is a kanban-based mini-app created with the use of [Vue.js](https://vuejs.org/), [Laravel](https://laravel.com/), [MySQL](https://www.mysql.com/), and [Tailwind CSS](https://tailwindcss.com/).

## General App Functionalities

- **User Management**: Users can register, log in, and log out. Authentication is handled via Laravel Sanctum personal access tokens, with role-based access control ensuring proper permissions for each user.

- **Board Management**: Users can create, view, and manage boards. Admins have additional privileges to modify board details such as list names, task due dates, assigned users, etc....

- **Task Organization**: Boards are organized into task lists, and tasks can be created, updated, moved between lists, and assigned to specific users. Admins can set due dates, priorities, and manage assignees.

- **Role Management**: Admins can manage user roles within boards, adding or removing members, promoting or demoting users, and controlling access to different functionalities.

- **Task Tracking**: Tasks within boards can be tracked and updated with status changes, priority levels, and deadlines. Task information is easily manageable by the assigned users or board admins.

- **Team Collaboration**: The app allows seamless collaboration by organizing tasks into boards and lists, ensuring teams can manage their work efficiently with controlled access to features based on roles.


## Setup

1. Clone this project to your local machine.
2. Run an SQL-compatible database and keep track of the credentials.
3. Remove .example from .env.example from the client and server subfolders to get the environment variables
4. Populate the database connection information in the server and the baseURL in the client
5.  Run the following scripts in a terminal.

```bash
# Install Vue.js dependencies
cd client
npm i && npm run dev

# Install Laravel dependencies
cd ../server
composer i && php artisan serve

# Populate the database
php artisan migrate && php artisan db:seed
```
6. Congrats! Everything should be running.

## Contributing

Since this is a one-off project, I won't be accepting pull requests. However, feel free to
fork this project and improve on it!

## License

[GPL-3.0](https://github.com/n-e-t-a-n/GoFlow/blob/main/LICENSE.md)