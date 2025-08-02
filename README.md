# Group Todo

This project is a minimal Django scaffold for a collaborative todo list.

## Setup

The Django project now lives inside the `backend/` directory. Dependencies
are managed with [Poetry](https://python-poetry.org/). Install them and
create the initial database migrations with:

```bash
cd backend
poetry install
python manage.py migrate
python manage.py runserver
```

The default database uses SQLite and stores data in `db.sqlite3`.
The backend exposes a REST API powered by Django REST Framework and
supports WebSocket connections through Django Channels.

## Docker Compose

You can also run the project using Docker Compose. This will start the backend
and frontend services behind an Nginx proxy:

```bash
docker-compose up --build
```

Visit `http://localhost:3000` to access the Parcel dev server. Requests under
`/api` are automatically routed to the Django backend.

## REST API

The API is available under the `/api/` path. Todo lists can be created with a
POST request to `/api/lists/`. Each list is identified by a unique `token` that
can be used to retrieve the list or its associated items. All CRUD operations
for todo items are exposed through `/api/items/`.

To fetch all items for a specific list, send a GET request to
`/api/lists/{token}/items/`.
