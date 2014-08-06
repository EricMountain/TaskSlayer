# Task Slayer

No frills, down to business [Eisenhower Matrix](http://en.wikipedia.org/wiki/Time_management#The_Eisenhower_Method) for task and priority management.

Webapp relying on browsers' HTML5 local storage, and optionally a local [CouchDB](http://couchdb.apache.org/) instance.


## Getting started

### Setup CouchDB (optional)

#### Install CouchDB

See [CouchDB docs](http://docs.couchdb.org/en/latest/install/index.html).

e.g. on Arch Linux:
* pacman -S couchdb
* systemctl enable couchdb
* systemctl start couchdb

#### [Enable CORS](http://wiki.apache.org/couchdb/CORS)

Edit the CouchDB local.ini file, e.g. /etc/couchdb/local.ini

[httpd]
...
enable_cors = true
...

[cors]
origins = http://localhost
methods = GET, POST, PUT, DELETE

#### Create a database

Create a DB called tasks: http://localhost:5984/_utils/

### Serve Task Slayer from a web server

Make the Task Slayer source files available from a web server, e.g. nginx:

```
    server {

        ...

        location /tasks {
             alias  /srv/www/whatever/TaskSlayer;
             index  index.html;
        }
```

### Using Task Slayer

Navigate to the TaskSlayer URL, e.g. http://localhost/tasks.

#### Keyboard shortcuts:

* Alt-N/S/D/W: Goto Now/Schedule/Delegat/Waste category.
* Alt-Shift-N/S/D/W: Move current task to another category.
* Enter: Create new task.
* Ctrl-Enter, Ctrl-Del: Mark task done.
* ...

## Credits

Task Slayer is built on top of the following:

- [HTML5 Boilerplate](http://html5boilerplate.com)
- [AngularJS](https://angularjs.org/)
- [CouchDB](http://couchdb.apache.org/)
- [jQuery](http://jquery.com/)
