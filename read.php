<?php
    // Read from staff_picks.item table, output JSON.

    $settings = parse_ini_file("etc/settings.ini", true);

    $con = mysql_connect($settings['MYSQL']['HOST'],$settings['MYSQL']['USER'],$settings['MYSQL']['PASS']);
    if (!$con) {
        die('Could not connect: ' . mysql_error());
    }

    mysql_select_db($settings['MYSQL']['DB'], $con);

    $retrieve = mysql_query("SELECT * FROM `item`") or die(mysql_error());
    $item_details = array();
    while($row = mysql_fetch_assoc($retrieve)) {
        $item_details[] = $row;
    }
    
    mysql_close($con);

    echo json_encode(array('items' => $item_details));
?>