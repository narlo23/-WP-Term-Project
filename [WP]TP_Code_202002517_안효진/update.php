<?php
    $file = fopen("./data/festival.json", "r");

    $checkarr = $_POST["checkarr"];
    $startdate = $_POST["startdate"];
    $enddate = $_POST["enddate"];
    $sortby = $_POST["sortby"];
    $radioval = $_POST["radioval"];

    $result = array();
    while(!feof($file)) {
        $line = fgets($file);
        if($line!="") {
            $arr = json_decode($line, true);

            if(count($checkarr)>=1) {
                for($i=1;$i<count($checkarr);$i++) {    //임시 방편으로 배열에 ""를 넣어뒀기 때문에 인덱스 1부터 접근
                    if($checkarr[$i] == implode($arr["area"])) {    //https://www.delftstack.com/ko/howto/php/how-to-convert-an-array-to-a-string-in-php/ (implode)
                        //기간이 입력된 경우
                        if($startdate != "") {
                            if($enddate != "") {                                
                                if($startdate<=$arr["startdate"] && $enddate>=$arr["enddate"]) {
                                    $result[] = $arr;
                                }
                            } else {
                                if($startdate<=$arr["startdate"]) {
                                    $result[] = $arr;
                                }
                            }
                        } else {
                            //기간이 입력되지 않은 경우
                            if($enddate!= "") {
                                if($enddate>=$arr["enddate"]) {
                                    $result[] = $arr;
                                }
                            } else {
                                $result[] = $arr;
                            }
                        }
                    }
                }
            }
        }
    }

    fclose($file);

    if($result==NULL) { //지역, 기간이 모두 입력되지 않았다면 json 다시 열어 모든 값을 result에
        $file = fopen("./data/festival.json", "r");

        while(!feof($file)) {
            $line = fgets($file);
            if($line!="") {
                $arr = json_decode($line, true);
                $result[] = $arr;
            }
        }
        fclose($file);
    }

    //http://www.w3bai.com/ko/php/func_array_multisort.html 62-65
    foreach($result as $key=>$value) {
        $date[$key] = $value["startdate"];      //날짜순 정렬 기준
        $dictionary[$key] = $value["name"];     //가나다순 정렬 기준
    }
    if($sortby == "date") {
        if($radioval == "오름차순") {
            array_multisort($date, SORT_ASC, $result);
        } else {
            array_multisort($date, SORT_DESC, $result);
        }
    } else if($sortby == "dictionary") {
        if($radioval == "오름차순") {
            array_multisort($dictionary, SORT_ASC, $result);
        } else {
            array_multisort($dictionary, SORT_DESC, $result);
        }
    }
    echo json_encode($result, JSON_UNESCAPED_UNICODE);
?>