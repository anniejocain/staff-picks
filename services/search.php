<?php

if (!empty($_GET['q'])) {
    
    $q = "q=" . urlencode($_GET['q']);
    
    if (preg_match("/^\d{9}/", $_GET['q'])) {
        $q = "q=bib:" . $_GET['q'];
    }
    
    $start = 0;
    $limit = 3;
    
    $formats = "+format:matManuscript+format:matBook";
    
    $url = "http://webservices.lib.harvard.edu/rest/hollis/search/mods/?$q$formats";
    $agent = 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1)';
    $ch = curl_init();  

    // set URL and other appropriate options  
    curl_setopt($ch, CURLOPT_URL, $url);  
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_USERAGENT, $agent);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);  

    // grab URL and pass it to the browser  

    $output = curl_exec($ch);
    curl_close($ch);

    $xml_response = new SimpleXMLElement($output);
    
    $total_results = $xml_response->totalResults[0];
    
    $to_out = [];
    $to_out['num_found'] = (int) $total_results;
    
    $docs = [];
    foreach ($xml_response->resultSet->item as $item) {
        $to_out_item = [];
        $raw_title = (string) $item->mods->titleInfo->title[0];
        $to_out_item['title'] = trim(preg_replace('/\s+/', ' ', $raw_title));
        
        $raw_creator = (string) $item->mods->name[0]->namePart[0];
        $to_out_item['creator'] = trim(preg_replace('/\s+/', ' ', $raw_creator));
        
        $raw_id_inst = (string) $item->mods->recordInfo[0]->recordIdentifier[0];
        $raw_id_inst = preg_replace('/-\d$/', ' ', $raw_id_inst);
        $to_out_item['id_inst'] = trim(preg_replace('/\s+/', ' ', $raw_id_inst));
        
        $raw_isbn = (string) $item->mods->identifier[0];
        $raw_isbn = preg_replace("/\s.*/", "", $raw_isbn);
        $to_out_item['id_isbn'] = trim(preg_replace('/\s+/', ' ', $raw_isbn));
        
        $docs[] = $to_out_item;
    }
    $to_out['docs'] = $docs;
    
    print json_encode($to_out, JSON_PRETTY_PRINT);
}

?>