<?php

if (!empty($_GET['q'])) {
    
    $q = urlencode($_GET['q']);
    
    $limit = 3;
    $start = 0;
    
    if (!empty($_GET['start'])) {
        $start = $_GET['start'];
    }
    
    $url = "http://webservices.lib.harvard.edu/rest/v2/hollisplus/search/dc/?q=$q";

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
    
    $to_out = array();
    $to_out['num_found'] = (int) $total_results;
    
    $docs = array();
    if (!empty($xml_response->resultSet->item)) {
        foreach ($xml_response->resultSet->item as $item) {
            $raw_title = (string) $item->children('dc', true)->title;
            $to_out_item['title'] = trim(preg_replace('/\s+/', ' ', $raw_title)); 
            
            $raw_creator = (string) $item->children('dc', true)->creator;
            $to_out_item['creator'] = trim(preg_replace('/\s+/', ' ', $raw_creator));
            
            $raw_id_inst = (string) $item['id'];
            $hollis_length = strlen($raw_id_inst);
            if($hollis_length < 9) {
                $loop = 9 - $hollis_length;
                for($j=0; $j<$loop; $j++){
                  $raw_id_inst = '0'.$raw_id_inst;
                }
            }
            $to_out_item['id_inst'] = trim(preg_replace('/\s+/', ' ', $raw_id_inst));
            
            $raw_isbn = '';
            foreach ($item->children('dc', true)->identifier as $identifier) {
                if (strpos($identifier,'ISBN') !== false) {
                    $raw_isbns = explode('ISBN: ', $identifier);
                    $raw_isbn = $raw_isbns[1]; 
                }
            }
            $raw_isbn = preg_replace("/\s.*/", "", $raw_isbn);
            $to_out_item['id_isbn'] = trim(preg_replace('/\s+/', ' ', $raw_isbn));
            
            $docs[] = $to_out_item;
        }
    }
    
    $sliced_docs = array_slice($docs, $start, $limit);
    
    $to_out['docs'] = $sliced_docs;
    
    print json_encode($to_out);
}

?>