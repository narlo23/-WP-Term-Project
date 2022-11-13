$("#register_info").click(function() {
    var check_val=true; //꼭 필요한 값(축제명, 지역, 기간)이 모두 입력되었는지 확인

    var festival_name = document.getElementById("festivalname").value;
    if(festival_name=="") { //축제 명이 입력되지 않았다면 false
        check_val=false;
    }

    var festival_area = []; //개최 지역을 저장할 배열

    var tmpid = "rg_check";
    while(true) {
        var area_val = document.getElementById(tmpid+num);  //checkbox의 아이디(check1~check18)를 이용하여 접근
        
        if(area_val == null)
            break;

        if(area_val.checked == true) {  //checkbox가 체크되어 있다면
            festival_area[festival_area.length] = area_val.value;
        }
    }

    if(festival_area.length == 0) { //선택된 checkbox가 없다면 false
        check_val=false;
    }

    var startdate = document.getElementById("rg_startdate").value;

    var enddate = document.getElementById("rg_enddate").value;

    if(startdate=="" || enddate=="") {  //시작일 또는 종료일이 입력되지 않은 경우 false
        check_val=false;
    } else if(startdate!="" && enddate!="") {   //둘 다 입력되었을 때,
        if(startdate>enddate) { //시작일이 종료일보다 늦다면 오류
            alert("기간을 정확히 입력해주세요.");
            check_val=false;
        } 
    }
    
    var festival_subject = document.getElementById("rg_subject").value;

    var festival_img = document.getElementById("festivalimg").value;
    if(festival_img!="") {
        var imgval = festival_img.split("\\");
        var filename = imgval[imgval.length-1];
        var filenamesplit = filename.toLowerCase().split(".");
        var fileextension = filenamesplit[filenamesplit.length-1];
        if(fileextension!="jpg" && fileextension!="png" && fileextension!="gif" && fileextension!="jpeg") {
            //jpg, png, gif, jpeg 형식의 파일만 저장 가능
            check_val=false;
            alert("제공되는 파일 형식이 아닙니다.");
        } 
    }
    
    var festival_content = document.getElementById("rg_content").value;

    if(check_val == false) {    //등록 실패
        alert("축제명, 개최 지역, 개최 기간을 다시 입력해주세요.");
    } else {
        $.ajax({        
            url : "./register.php",
            type : 'POST',
            data : {
                name : festival_name,
                area : festival_area,
                startdate : startdate,
                enddate : enddate,
                subject : festival_subject,
                img : filename,
                content : festival_content
            }, success(data) {
                alert(data);        //저장되었습니다.
                location.reload();  //페이지 새로고침
            }
        });
    }
});

$("#register_cancel").click(function() {        //취소 버튼 누를 시 해당 창 닫음
    window.close();
});