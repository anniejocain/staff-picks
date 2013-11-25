<?php

// Receive a new item. Add it to the DB. Get cover and store it.
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if(!empty($_POST['title']) && !empty($_POST['hollis']) && !empty($_POST['selected_by'])) {
        
        $settings = parse_ini_file("etc/settings.ini", true);
        print_r($settings);
        
        $title = $_POST['title'];
        $hollis = $_POST['hollis'];
        $selected_by = $_POST['selected_by'];

        $isbn = '';    
        if (!empty($_POST['isbn'])) {
            $isbn = $_POST['isbn'];
        }
    
        $cover_path = '';
        if (!empty($_POST['cover_path'])) {
            $cover_path = $_POST['cover_path'];
        }
    
        // We shold now have all of our values. Let's write them to the DB    
       $con = mysql_connect($settings['MYSQL']['HOST'],$settings['MYSQL']['USER'],$settings['MYSQL']['PASS']);
       if (!$con) {
           die('Could not connect: ' . mysql_error());
       }
   
       mysql_select_db($settings['MYSQL']['DB'], $con);

       $sqlCmd = sprintf("INSERT INTO item (title, hollis, isbn, selected_by, cover_path) 
         VALUES ('%s','%s','%s','%s','%s')", 
          mysql_real_escape_string($_POST["title"]),
          mysql_real_escape_string($_POST["hollis"]),
          mysql_real_escape_string($_POST["isbn"]),
          mysql_real_escape_string($_POST["selected_by"]),
          mysql_real_escape_string($_POST["cover_path"]));

       mysql_query($sqlCmd);
       mysql_close($con);
    }
}
?>