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
