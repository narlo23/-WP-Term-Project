<?php
    $file = fopen("./data/festival.json", "a");

    $infoArray;

    $name = $_POST["name"];
    $area = $_POST["area"];
    $startdate = $_POST["startdate"];
    $enddate = $_POST["enddate"];
    $subject = $_POST["subject"];
    $img = $_POST["img"];
    $content = $_POST["content"];
    
    $arr = array("name" => $name, "area" => $area, "startdate" => $startdate
    , "enddate" => $enddate, "subject" => $subject, "img" => $img, "content" => $content);

    fwrite($file, json_encode($arr, JSON_UNESCAPED_UNICODE)."\n");  //json 파일에 배열을 encoding하여 작성
    echo("저장되었습니다.");

    fclose($file);
?>