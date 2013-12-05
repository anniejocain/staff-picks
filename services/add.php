<?php

// Receive a new item. Add it to the DB. Get cover and store it.
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if(!empty($_POST['title']) && !empty($_POST['selected_by'])) {
        
        $settings = parse_ini_file("../etc/settings.ini", true);
        
        // Setup our values to be inserted in to the DB
        $title = trim($_POST['title']);
        $hollis = $_POST['hollis'];
        $selected_by = $_POST['selected_by'];

        $isbn = '';    
        if (!empty($_POST['isbn'])) {
            $isbn = $_POST['isbn'];
        }
    
        // If we get a cover path, let's download it and write that path to the DB
        // else, just use a stock cover
        
        if (strpos($_POST['cover_path'], 'img/covers/stock/cover') === 0) {
            $cover_path = $_POST['cover_path'];
        } else{
            $cover_path = download_file($_POST['cover_path'], $hollis);
        }
    
        // We should now have all of our values. Let's write them to the DB    
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
          mysql_real_escape_string($cover_path));

       mysql_query($sqlCmd);
       mysql_close($con);
    }
}

function download_file($url, $hollis) {
    // Download cover at $url. Use the $hollis id as the filename.
    
    $url_pieces = explode('.', $url);
    $file_ext = end($url_pieces)    ;
    $file_path = "img/covers/$hollis.$file_ext";
    
    $agent = 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1)';

    $fp = fopen ("../$file_path", 'w+');
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 50);
    curl_setopt($ch, CURLOPT_FILE, $fp);
    curl_setopt($ch, CURLOPT_HEADER,0);
    curl_setopt($ch, CURLOPT_BINARYTRANSFER,1);
    curl_setopt($ch, CURLOPT_USERAGENT, $agent);
    curl_exec($ch);
    curl_close($ch);
    fclose($fp); 
    
    return $file_path;
}

?>