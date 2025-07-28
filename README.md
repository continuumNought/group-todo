# Group Todo

This project is a minimal Django scaffold for a collaborative todo list.

## Setup

The repository contains the basic project layout. To run it you need to
install Django and then create the initial database migrations.

```bash
pip install django
python manage.py migrate
python manage.py runserver
```

The default database uses SQLite and stores data in `db.sqlite3`.
