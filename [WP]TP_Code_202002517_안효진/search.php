<?php
    $file = fopen("./data/festival.json", "r");

    $result = array();
    $i=0;
    $search = $_POST["search"];

    while(!feof($file)) {
        $line = fgets($file);
        if($line!="") {
            $arr = json_decode($line, true);

            $name = $arr["name"];
            $subject = $arr["subject"];

            //축제명과 축제 소재를 이용하여 찾고자 하는 값 검색(strpos를 이용하여 해당 문자열을 포함하는지)
            if(strpos($name, $search)!==false && strpos($subject, $search)!==false) {
                $result[$i] = $arr;
                $i++;
            }
        }
        
    }
    echo json_encode($result, JSON_UNESCAPED_UNICODE);
    fclose($file);

?>