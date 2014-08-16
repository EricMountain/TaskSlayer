# Task Slayer

No frills, down to business [Eisenhower Matrix](http://en.wikipedia.org/wiki/Time_management#The_Eisenhower_Method) for task and priority management.

Webapp relying on browsers' HTML5 local storage, and optionally a local [CouchDB](http://couchdb.apache.org/) instance.


## Getting started

### Download the code

````Shell
git clone https://github.com/EricMountain/TaskSlayer.git
````

### Serve Task Slayer from a web server

Make the Task Slayer source files available from a web server, e.g. nginx:

```Nginx
    server {

        ...

        location /tasks {
             alias  /srv/www/whatever/TaskSlayer;
             index  index.html;
        }
```

### Setup CouchDB (optional)

If you install CouchDB, task data will be saved both to HTML5 local
storage and the CouchDB instance on your system, otherwise it will only
be saved to local storage.

If you rely only on local storage, then ensure that it is not cleaned,
e.g. on browser exit.  In Chrome and Firefox for instance, this means
ensuring:
* your browser does not delete cookies on exit
* you don't delete all cookies or the cookies related to the site you
server the app from


#### Install CouchDB

See [CouchDB docs](http://docs.couchdb.org/en/latest/install/index.html).

e.g. on Arch Linux:
* pacman -S couchdb
* systemctl enable couchdb
* systemctl start couchdb

#### Enable [CORS](http://wiki.apache.org/couchdb/CORS)

Edit the CouchDB local.ini file, e.g. /etc/couchdb/local.ini

````
[httpd]
...
enable_cors = true
...

[cors]
origins = http://localhost
methods = GET, POST, PUT, DELETE
````

#### Create a database

Create a DB called tasks: http://localhost:5984/_utils/

### Using Task Slayer

Navigate to the TaskSlayer URL, e.g. http://localhost/tasks.

#### Keyboard shortcuts:

* Alt-N/S/D/W: Goto Now/Schedule/Delegate/Waste category.
* Alt-Shift-N/S/D/W: Move current task to another category.
* Enter,Ctrl-Shift-Insert: Create new task after/before the current one.
* Ctrl-Shift-Enter, Ctrl-Shift-Del: Mark task done.
* Ctrl-Home/End: go to top/bottom of current category.
* Ctrl-Shift-Home/End: move current task to top/bottom of the category.
* ...

## Credits

Task Slayer is built on top of the following:

- [HTML5 Boilerplate](http://html5boilerplate.com)
- [AngularJS](https://angularjs.org/)
- [CouchDB](http://couchdb.apache.org/)
- [jQuery](http://jquery.com/)
- [perfect-scrollbar](http://noraesae.github.io/perfect-scrollbar/)
- [angular-perfect-scrollbar](https://github.com/itsdrewmiller/angular-perfect-scrollbar)
- [RequireJS](http://requirejs.org/)
