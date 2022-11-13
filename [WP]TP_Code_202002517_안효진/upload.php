<?php
    $file = fopen("./data/festival.json", "r");

    $result = array();

    $i=0;
    while(!feof($file)) {
        $line = fgets($file);
        if($line!="") {
            $arr = json_decode($line, true);
            $result[$i]=$arr;
        }
        $i++;
    }

    //한글로 작성된 파일이기 때문에 JSON_UNESCAPED_UNICODE 작성해주기
    echo json_encode($result, JSON_UNESCAPED_UNICODE);
    fclose($file);
?>