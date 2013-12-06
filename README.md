Staff picks
====


## Install Notes

### Configure settings
Settings are held in etc/settings.ini. Copy that file from the example and edit it with your values.

        cp settings.example.ini settings.ini

### Configure DB
Create the DB. If you're using MySQL, you might do something like this:

        create database staff_picks character set utf8;
        grant all on staff_picks.* to staff_picks@'localhost' identified by 'staff_picks';
        CREATE TABLE item (id INT AUTO_INCREMENT PRIMARY KEY, title varchar(1000), hollis varchar(20), isbn varchar(20), selected_by varchar(1000), cover_path varchar(1000), picked TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

### Set permissions
Images are saved in staff-picks/img and your webserver will need to write to that directory. Change that directory to be owned by your webserver's user, or just open the permissions wide:

        chmod 777 covers

## License
Dual licensed under the MIT license (below) and [GPL license](http://www.gnu.org/licenses/gpl-3.0.html).

<small>
MIT License

Copyright (c) 2013 The Harvard Library Innovation Lab

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
</small>