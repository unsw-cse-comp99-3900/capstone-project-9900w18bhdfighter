import os
import django
from django.core.management import call_command
from django.conf import settings
import MySQLdb


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
django.setup()

def reset_mysql_database():
    db_name = settings.DATABASES['default']['NAME']
    db_user = settings.DATABASES['default']['USER']
    db_password = settings.DATABASES['default']['PASSWORD']
    db_host = settings.DATABASES['default']['HOST']
    db_port = settings.DATABASES['default']['PORT']

    conn = MySQLdb.connect(user=db_user, passwd=db_password, host=db_host, port=int(db_port))
    conn.autocommit(True)
    cursor = conn.cursor()
    try:
        cursor.execute('DROP DATABASE IF EXISTS `{}`;'.format(db_name))
        cursor.execute('CREATE DATABASE `{}`;'.format(db_name))
    except MySQLdb.Error as err:
        print(f"Error: {err}")
    finally:
        cursor.close()
        conn.close()

def reset_database():
    db_engine = settings.DATABASES['default']['ENGINE']
    if db_engine == 'django.db.backends.mysql':
        reset_mysql_database()
    else:
        print('This script currently supports only MySQL.')

    call_command('migrate')


if __name__ == '__main__':
    reset_database()
