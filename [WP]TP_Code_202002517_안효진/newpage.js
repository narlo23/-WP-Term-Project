$(function() {
    var findname = localStorage.getItem("findname");    //localStorage 이용하여 축제 이름 가져오기

    $.ajax({        //축제 이름을 이용하여 data를 
        url : "newpage.php",
        type : "POST",
        data : {
            name : findname     
        },
        success(data) {
            var result = JSON.parse(data);  //ajax를 이용해 받은 data를 parsing

            var imgtag = document.getElementById("festival_img_upload");
            var imgsrc = result[0].img;
            var source="./images/" + imgsrc;        //이미지 경로 지정
            imgtag.setAttribute("src", source);

            var title = document.getElementById("festival_title");
            title.innerHTML = result[0].name;

            var term = document.getElementById("festival_term");
            term.innerHTML = result[0].startdate + " ~ " + result[0].enddate;

            var content = document.getElementById("festival_content_update");
            var tmpcontent = result[0].content.split("\n");
            
            var showcontent="";
            for(var i=0;i<tmpcontent.length;i++) {
                showcontent += tmpcontent[i]+"<br>";        //html에서 \n은 공백 하나로 취급되기 때문에 \n으로 파싱하여 <br>을 이용하여 줄바꿈
            }
            content.innerHTML=showcontent;
        }
    });

});