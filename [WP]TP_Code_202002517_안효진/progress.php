<?php
    $file = fopen("./data/festival.json", "r");

    $in_check = $_POST["in_check"];
    $before_check = $_POST["before_check"];
    $past_check = $_POST["past_check"];
    $today = $_POST["dateString"];

    $result = array();

    while(!feof($file)) {
        $line = fgets($file);

        if($line!="") {
            $arr = json_decode($line, true);
            if($in_check=="true") {
                if($before_check=="true") {
                    if($past_check=="true") {       //진행중, 진행전, 종료
                        $result[] = $arr;
                    } else {                        //진행중, 진행전
                        if($today<$arr["enddate"]) {
                            $result[] = $arr;
                        }
                    }
                } else {
                    if($past_check=="true"){        //진행중, 종료
                        if($today>=$arr["startdate"]) {
                            $result[] = $arr;
                        } 
                    } else {                        //진행중
                        if($today>=$arr["startdate"] && $today<=$arr["enddate"]) {
                            $result[] = $arr;
                        }
                    }
                }
            } else {
                if($before_check=="true") {
                    if($past_check=="true") {   //진행전, 종료
                        if($today>$arr["enddate"] || $today<$arr["startdate"]) {
                            $result[] = $arr;
                        }
                    } else {    //진행전
                        if($today<$arr["startdate"]) {
                            $result[] = $arr;
                        }
                    }
                } else {
                    if($past_check=="true") {       //종료
                        if($today>$arr["enddate"]) {
                            $result[] = $arr;
                        }
                    }
                }
            }
        }
    }

    echo json_encode($result, JSON_UNESCAPED_UNICODE);

    fclose($file);

?>