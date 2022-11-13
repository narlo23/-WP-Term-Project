$("#title").click(function() {
    //title을 클릭했을 때 main페이지로 이동
    location.href="./main.html";
});

$("#searchbtn").click(function() {
    var search = document.getElementById("localsearch").value;
    //검색 버튼 클릭 시 결과 update 부분
    if(search!="") {
        $.ajax({
            url : "search.php",
            type : "POST",
            data : {
                search : search
            }, success(data) {
                maketable(data);    //결과 테이블 만들기
            }
        });
    } else {    //textbox에 입력된 값이 없다면 페이지 reload
        location.href="./main.html";
    }
});

$("#register").click(function() {   //축제 등록하기 창을 새 창으로 열기
    window.open("./register.html", "_blank");
});

function removediv() {  //table을 추가할 div인 result를 불러와 모든 자식들 지우기
    const parent = document.getElementById("result");

    while(parent.hasChildNodes()) {
        parent.removeChild(parent.firstChild);
    }
}

//첫 화면
$(function() {
    $.ajax({    //첫 화면(결과 테이블(모든 축제 정보))
        url:"./upload.php",
        success:function(data) {
           
            maketable(data);
        }
    });

    var in_progress = document.getElementById("in_progress");       //진행 중
    var before_progress = document.getElementById("before_progress");   //진행 전
    var past = document.getElementById("past");     //지난 축제

    //이벤트리스너 추가, 모두 같은 함수 실행(하나라도 바뀌면 같은 기능 실행)
    in_progress.addEventListener("change", update_progress);
    before_progress.addEventListener("change", update_progress);
    past.addEventListener("change", update_progress);
});

function trclick() {
    //테이블 클릭 시 해당 축제와 관련된 내용을 설명하기 위한 페이지로 이동
    var tr=document.getElementById(this.id);
    var td = tr.firstChild.innerHTML;   //행의 첫 번째 자식의 innerHTML (축제명)
    if (typeof(Storage) !== "undefined") { //localStorage가 지원된다면
        localStorage.findname = td;
    }
    window.open("./newpage.html", "_blank");    //해당 축제 페이지 새 창에 열기
}

function trover() {
    //mouseover 이벤트 함수
    this.setAttribute("background-color","gray");
}

function maketable(data) {
    var parent = document.getElementById("result");
    removediv();    //parent의 모든 자식들 삭제

    var result = JSON.parse(data);  //ajax를 이용해 받은 data를 parsing

    var result_len = result.length; //data의 길이 구하기

    if(result_len != 0) {   //결과 테이블에 나타내야 하는 값이 존재하는 경우
        var newtable = document.createElement("table");
        newtable.id="resulttable";

        var newtr = document.createElement("tr");

        var newth = document.createElement("th");
        newth.innerHTML = "축제명";
        newth.setAttribute("width", "30%");
        newtr.appendChild(newth);

        var newth = document.createElement("th");
        newth.innerHTML = "지역";
        newth.setAttribute("width", "10%");
        newtr.appendChild(newth);

        var newth = document.createElement("th");
        newth.innerHTML = "개최기간";
        newth.setAttribute("width", "25%");
        newtr.appendChild(newth);

        var newth = document.createElement("th");
        newth.innerHTML = "축제소재";
        newth.setAttribute("width", "20%");
        newtr.appendChild(newth);

        var newth = document.createElement("th");
        newth.innerHTML = "D-Day";
        newth.setAttribute("width", "15%");
        newtr.appendChild(newth);

        newtable.appendChild(newtr);

        parent.appendChild(newtable);
        
        var today = new Date();         //Date 객체를 이용해 현재 날짜 구하기
        
        for(var i=0;i<result_len;i++) { //data로 받아온 개수만큼 반복
            var newtr = document.createElement("tr");

            var newtd = document.createElement("td");
            newtd.innerHTML = result[i].name;
            newtr.appendChild(newtd);

            var newtd = document.createElement("td");
            newtd.innerHTML = result[i].area;
            newtr.appendChild(newtd);

            var newtd = document.createElement("td");
            newtd.innerHTML = result[i].startdate + " - " + result[i].enddate;
            newtr.appendChild(newtd);

            var newtd = document.createElement("td");
            newtd.innerHTML = result[i].subject;
            newtr.appendChild(newtd);

            var newtd = document.createElement("td");

            var daystr;     //결과 테이블에 나타날 D-day 값
            var getdday;    //현재 날짜와의 차이
            var startdate = new Date(result[i].startdate);
            var enddate = new Date(result[i].enddate);
                
            if(today>enddate) {     //종료 날짜가 오늘보다 작은 경우(지난 축제의 경우)
                daystr="종료";
            } else if(today<startdate) {        //시작 날짜가 오늘보다 큰 경우(진행 전)
                getdday = startdate.getTime() - today.getTime();
                daystr = "D-" + Math.ceil(getdday / (1000*60*60*24));
            } else {   //진행 중
                getdday = enddate.getTime() - today.getTime();  
                daystr = "D+" + Math.ceil(getdday / (1000*60*60*24));
            }

            newtd.innerHTML = daystr;
            newtr.appendChild(newtd);

            var tmpid = "tr" + i;
            newtr.id=tmpid;
            newtr.addEventListener('click', trclick);
            //이벤트리스너를 이용하여 mouseover 이벤트가 발생하면 배경색 변경
            newtr.addEventListener('mouseover', function() {
                $(this).css("background-color", "lightgray");
            });
            //mouseleave 이벤트가 발생하면 배경색 원래대로 돌려놓기
            newtr.addEventListener('mouseleave', function() {
                $(this).css("background-color", "white");
            })
            newtable.appendChild(newtr);
        }
        
    }
}

$("#filter").click(function() { //조건에 맞춰 검색
    var checkarr=[""];  //빈 배열의 경우 ajax에 data를 넘겨줄 때 오류가 나는 것을 방지하기 위한 임시방편...
    var tmpid="check";
    for(var i=1;i<=18;i++) {    //모든 checkbox의 체크 여부 확인하여 checkarr에 대입
        var tmpcheck = document.getElementById(tmpid+i);
        if(tmpcheck.checked) {
            checkarr[checkarr.length]=tmpcheck.value;
        }
    }
    
    var startdate = document.getElementById("startdate").value;
    var enddate = document.getElementById("enddate").value;
    
    var sortby = document.getElementById("sort").value;
    var radios = document.getElementsByName("sortradio");
    var radioval="";
    for(var i=0;i<radios.length;i++) {      //2개의 라디오 버튼 check여부 확인(하나만 체크 가능)
        if(radios[i].checked) {
            radioval=radios[i].value;
            break;
        }
    }
    
    $.ajax({
        url:"update.php",
        type:"POST",
        data : {
            checkarr : checkarr,
            startdate : startdate,
            enddate : enddate,
            sortby : sortby,
            radioval : radioval
        }, success(data) {
            maketable(data);        //필터링을 거친 결과 테이블
        }
    })
});

function update_progress() {    //진행중, 진행전, 지난 축제의 이벤트리스너 함수
    var in_check = document.getElementById("in_progress").checked;
    var before_check = document.getElementById("before_progress").checked;
    var past_check = document.getElementById("past").checked;

    var today = new Date();

    //출처 : https://gent.tistory.com/413 (날짜 string으로 변환하기) 218-222
    var year = today.getFullYear();
    var month = ('0' + (today.getMonth() + 1)).slice(-2);
    var day = ('0' + today.getDate()).slice(-2);

    var dateString = year + '-' + month  + '-' + day;
    $.ajax({
        url : "progress.php",
        type : "POST",
        data : {
            in_check : in_check,
            before_check : before_check,
            past_check : past_check,
            dateString : dateString
        }, success(data) {
            maketable(data);
        }
    });
}