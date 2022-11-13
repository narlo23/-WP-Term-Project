<?php
    $file = fopen("./data/festival.json", "r");

    function test_input($data) {
        $data = ltrim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
        return $data;
    }

    $findname = $_POST["name"];
    $name = test_input($findname);
    
    $result = array();
    $i=0;
    while(!feof($file)) {
        $line = fgets($file);
        if($line!="") {
            $arr = json_decode($line, true);    //배열로

            if($arr["name"]==$name) {       //찾고자 하는 축제 이름과 json 파일의 name 값이 같으면
                $result[$i]=$arr;
                $i++;
            }
        }
        
    }

    echo json_encode($result, JSON_UNESCAPED_UNICODE);

    fclose($file);

?>