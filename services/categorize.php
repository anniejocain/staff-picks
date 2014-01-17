<?php

$settings = parse_ini_file("../etc/settings.ini", true);

$con = mysql_connect($settings['MYSQL']['HOST'],$settings['MYSQL']['USER'],$settings['MYSQL']['PASS']);
    if (!$con) {
        die('Could not connect: ' . mysql_error());
    }

    mysql_select_db($settings['MYSQL']['DB'], $con);
    $query = "SELECT `hollis` FROM `item` GROUP BY `hollis` limit 200";
    //$query = "SELECT `hollis` FROM `item_copy` WHERE `hollis` = '013770997'";

    $retrieve = mysql_query($query) or die(mysql_error());
    $item_details = array();
    while($row = mysql_fetch_assoc($retrieve)) {
        $item_details[] = $row['hollis'];
    }
    

foreach($item_details as $hollis){
    echo "<br><br><p>$hollis</p>";

$url = "http://webservices.lib.harvard.edu/rest/mods/hollis/$hollis";

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch,CURLOPT_HTTPHEADER,array('Accept: application/json'));

$contents = curl_exec ($ch);
	
curl_close ($ch);
	
$record = json_decode($contents);
print_r($record->mods->genre);

$fiction = 0;
$nonfiction = 0;
$juvenile = 0;
$humor = 0;
$biography = 0;
$history = 0;
$comics = 0;
$historical = 0;
$fantasy = 0;

$raw = '';

$genres = $record->mods->genre;
if(!$genres->content) {
    foreach($genres as $genre){
        echo "<p>" . $genre->content . "</p>";
        $raw .= $genre->content . ' ';
        if (strpos(strtolower($genre->content), 'fiction') !== FALSE)
            $fiction = 1;
    }
}
else {
    echo "<p>" . $genres->content . "</p>";
    $raw .= $genres->content . ' ';
    if (strpos(strtolower($genres->content), 'fiction') !== FALSE)
            $fiction = 1;
}

echo "<p>SUBJECTS</p>";
$categories = $record->mods->subject;
if(count($categories) > 0) {
    foreach($categories as $category) {
        echo "<p>MULTI " . $category->topic . " ::: " . $category->genre . "</p>";
        $raw .= $category->topic . ' ' . $category->genre . ' ';
        echo "RAW SO FAR $raw";
    }
}
else { 
    echo "<p>" . $categories->topic . " ::: " . $categories->genre . "</p>";
    $raw .= $categories->topic . ' ' . $categories->genre . ' ';
    }
    
echo "RAW STRING IS $raw";
    
if($fiction != 1) $nonfiction = 1;   
if (strpos(strtolower($raw), 'fiction') !== FALSE)
    $fiction = 1;    
if (strpos(strtolower($raw), 'juvenile') !== FALSE)
    $juvenile = 1; 
if (strpos(strtolower($raw), 'humor') !== FALSE)
    $humor = 1; 
if (strpos(strtolower($raw), 'biography') !== FALSE)
    $biography = 1; 
if (strpos(strtolower($raw), 'history') !== FALSE && $fiction === 0)
    $history = 1; 
if (strpos(strtolower($raw), 'comics') !== FALSE)
    $comics = 1; 
if (strpos(strtolower($raw), 'graphic novel') !== FALSE)
    $comics = 1; 
if (strpos(strtolower($raw), 'historical fiction') !== FALSE)
    $historical = 1; 
if (strpos(strtolower($raw), 'fantasy') !== FALSE)
    $fantasy = 1; 
    
$sqlCmd = "UPDATE `item` SET `fiction` = '$fiction', `nonfiction` = '$nonfiction', `juvenile` = '$juvenile', `humor` = '$humor', `biography` = '$biography', `comics` = '$comics', `history` = '$history', `historical` = '$historical', `fantasy` = '$fantasy'  WHERE `hollis` = '$hollis';";

       mysql_query($sqlCmd);

}
       mysql_close($con);
?>