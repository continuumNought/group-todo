# Group Todo

This project is a minimal Django scaffold for a collaborative todo list.

## Setup

The repository contains the basic project layout. Dependencies are
managed with [Poetry](https://python-poetry.org/). Install them and create
the initial database migrations with:

```bash
poetry install
python manage.py migrate
python manage.py runserver
```

The default database uses SQLite and stores data in `db.sqlite3`.
