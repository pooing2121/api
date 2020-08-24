var ballRed = 'cicle-red';
var ballBlue = 'cicle-blue';
var ballGreen = 'cicle-green';
var setBlue = '<div style="background: #000080 ;color: #ffffff; padding:5px"><img src="img/player.gif" style="opacity: 1; height:50px;">&nbspสูตรบอกแทง PLAYER</div>';
var setRed = '<div style="background: #FF0000 ;color: #ffffff; padding:5px"><img src="img/banker.gif" style="opacity: 1; height:50px;">&nbspสูตรบอกแทง  BANKER</div>';
var ready = '<div style="background: #4F4F4F ;color: #ffffff;    padding:5px; border-style:solid; border-color: #ffffff;  border-width: 0px 1px 1px 1px;">รอเข้าสูตร</div>';
var refil = '';
var setResultWIN = '<div style="background: #ccffcc ;color: #000000; padding:5px">ยินดีด้วยคุณชนะ </div>';
var setResultLOSE = '<div style="background: #000000 ;color:#ffffff; padding:5px">เสียใจด้วยคุณแพ้ แนะนำให้เปลี่ยนห้อง</div>';
var setResult1 = '<div  style="margin-top:12px;">ไม้ 1 </div>';
var setResult2 = '<div  style="margin-top:12px;">ไม้ 2 </div>';
var setResult3 = '<div  style="margin-top:12px;">ไม้ 3 </div>';
var setResultCount = '<div  style="margin-top:13px;"> &nbsp; </div>';
var setResultRe = '<div style="background: #4F4F4F ;color: #ffffff;    padding:5px; border-style:solid; border-color: #ffffff;  border-width: 1px 1px 0px 1px;">&nbsp;</div>';
var credit1 = '<div style="background: #000000 ;color:#ffffff; padding:5px">กรุณาเติมเคดิต</div>';
var credit2 = '<div style="background: #000000 ;color:#ffffff; padding:5px">AddLINE ID ค่ะ</div>';
//    var formular1 = [];
//    var countFormula1 = 0;

var addBall = function (ball) {
    $(".currentBall").addClass("prevBall2");
    $(".currentBall").removeClass("currentBall");
    $(".noBall2:first").addClass("currentBall");
    $(".noBall2:first").removeClass("noBall2");
    $(".currentBall >.ball2").addClass(ball);
};
var removeBall = function () {
    $(".currentBall >.ball2").removeClass(function (index, css) {
        return (css.match(/(^|\s)cicle-\S+/g) || []).join(' ');
    });
    $(".currentBall").addClass("noBall2");
    $(".prevBall2:last").addClass("currentBall");
    $(".prevBall2:last").addClass("prevBall2");
    $(".currentBall:last").removeClass("currentBall");
    $(".prevBall2:last").removeClass("prevBall2");
};
var resetBall = function () {
    $(".ball-grid2").removeClass("currentBall");
    $(".ball-grid2").removeClass("prevBall2");
    $(".ball-grid2").addClass("noBall2");
    $(".ball-grid2 >.ball2").removeClass(function (index, css) {
        return (css.match(/(^|\s)cicle-\S+/g) || []).join(' ');
    });
};
var renderTable = function () {
    var grid = '<div class="myCol"> ';
    grid += '   <div class="ball-grid2"><div class="ball2"></div></div> ';
    grid += '   <div class="ball-grid2"><div class="ball2"></div></div> ';
    grid += '   <div class="ball-grid2"><div class="ball2"></div></div> ';
    grid += '   <div class="ball-grid2"><div class="ball2"></div></div> ';
    grid += '   <div class="ball-grid2"><div class="ball2"></div></div> ';
    grid += '   <div class="ball-grid2"><div class="ball2"></div></div> ';
    grid += ' </div>';
    for (i = 0; i < 12; i++) {
        $("#myCalculateTable").append(grid);
    }
};
$(function () {
    renderTable();
    loadHistory();
    loadCredit();
    loadcreditTable();
    loadstatisticTable();
//        loadaPlanmoney();
    $(".ball-grid2").addClass("noBall2");
    $("#addBallRed").on("click", function () {
        cal2('B');
        addBall(ballRed);
    });
    $("#addBallGreen").on("click", function () {
        addBall(ballGreen);
    });
    $("#addBallBlue").on("click", function () {
        cal2('P');
        addBall(ballBlue);
    });
});
function loadcreditTable() {
    $("#creditTable").load("ajax_load_credit.php");
}
function loadHistory() {
    $("#statistic").load("ajax_statistic.php");
}

function loadstatisticTable() {
    $("#statisticTable").load("ajax_load_statistic.php");
}
function loadaPlanmoney() {
    $("#planmoney").load("ajax_planmoney.php");
}
var cal2 = function (arg) {
    var url = 'function/function.php?click=' + arg;
    $.getJSON(url, function (resp) {
        console.log('cal2.resp >>> ' + JSON.stringify(resp));
        if (resp.credit === '0') {
            resetTable();
            $('#Result').html(credit1);
            $('#NextBet').html(credit2);
        } else {
            if (resp.point === 'B') {
                $('#NextBet').html(setRed);
            } else if (resp.point === 'P') {
                $('#NextBet').html(setBlue);
            } else if (resp.point === '') {
                $('#CountBet').html(setResultCount);
                $('#Result').html(setResultRe);
                $('#NextBet').html(ready);
            }

            if (resp.result === 'WIN') {
				play_win();
                $('#Result').html(setResultWIN);
                loadHistory();
                loadCredit();
                loadstatisticTable();

            } else if (resp.result === 'LOSE') {
				play_lose();
                $('#Result').html(setResultLOSE);
                loadHistory();
                loadstatisticTable();
            } else if (resp.result === '') {
                $('#Result').html(setResultRe);
                $('#CountBet').html(setResultCount);
            }

            if (resp.clickWin === '1') {
			    play_1();
                $('#CountBet').html(setResult1);
            } else if (resp.clickWin === '2') {
			    play_1();	
                $('#CountBet').html(setResult2);
            } else if (resp.clickWin === '3') {
				play_1();
                $('#CountBet').html(setResult3);
            } else if (resp.result === '') {
                $('#CountBet').html(setResultCount);
            }
            if (resp.point === '') {
                $('#CountBet').html(setResultCount);
            }

        }
    });

};
function undoBall() {
    removeBall();
    $.post("function/function.php", {
        data: 'undoBall'},
            function () {
//                    window.location.reload();

            }

    );

}
function loadCredit() {
    $("#credit").load("ajax_credit.php");
}


function resetTable() {
    resetBall();
    $('#CountBet').html(setResultCount);
    $('#Result').html(setResultRe);
    $('#NextBet').html(ready);
    $.post("function/function.php", {
        data: 'resetTable'},
            function () {
//                    window.location.reload();

            }

    );
}

function resetHistory() {
    $.post("function/function.php", {
        data: 'resetHistory'},
            function () {
                window.location.reload();
            }
    );
}
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#blah').attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
        var div = document.getElementById('blah');
        div.style.visibility = 'visible';
        var divold = document.getElementById('blah-old');
        divold.style.display = 'none';
    }
}

function credit(username) {
    $("#user_id").val(username);
}

function save() {
    $.ajax({
        type: "POST",
        url: 'ajax_add_credit.php',
        data: jQuery("#formId").serialize(),
        cache: false,
        success: function (data) {
            if (data === '1') {
                $("#user_id").val("");
                $("#price").val("");
                $("#qty").val("");
                alert('เพิ่มเคดิตเรียบร้อย');
                loadCredit();
                loadcreditTable();
            }
            if (data === '0') {
                alert('กรุณากรอกข้อมูลให้ครบ');
            }

        }
    });

}

function search() {
    $.ajax({
        type: "POST",
        url: 'ajax_load_user.php',
        data: jQuery("#formSearch").serialize(),
        cache: false,
        success: function (data) {
            loadUser();
            return false;
        }
    });

}

function loadUser() {
    $("#creditTable").load("ajax_load_user.php");
}

function Topup() {
    $.ajax({
        type: "POST",
        url: 'ajax_add_topup.php',
        data: jQuery("#formTopup").serialize(),
        cache: false,
        success: function (data) {
            if (data === '1') {
                $("#price").val("");
                $("#time").val("");
                alert('แจ้งการโอนเงินเรียบร้อยรอการตรวจสอบจากระบบ');
            }
            if (data === '0') {
                alert('กรุณากรอกข้อมูลให้ครบ');
            }

        }
    });

}

// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
        // Logged into your app and Facebook.
        testAPI();
    } else if (response.status === 'not_authorized') {
        // The person is logged into Facebook, but not your app.
        document.getElementById('status').innerHTML = 'Please log ' +
                'into this app.';
    } else {
        // The person is not logged into Facebook, so we're not sure if
        // they are logged into this app or not.
        document.getElementById('status').innerHTML = 'Please log ' +
                'into Facebook.';
    }
}

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });
}

window.fbAsyncInit = function () {
    FB.init({
        appId: '845222345578843',
        cookie: true, // enable cookies to allow the server to access 
        // the session
        xfbml: true, // parse social plugins on this page
        version: 'v2.5' // use graph api version 2.5
    });

    // Now that we've initialized the JavaScript SDK, we call 
    // FB.getLoginStatus().  This function gets the state of the
    // person visiting this page and can return one of three states to
    // the callback you provide.  They can be:
    //
    // 1. Logged into your app ('connected')
    // 2. Logged into Facebook, but not your app ('not_authorized')
    // 3. Not logged into Facebook and can't tell if they are logged into
    //    your app or not.
    //
    // These three cases are handled in the callback function.

    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });

};

// Load the SDK asynchronously
(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id))
        return;
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


function Logout() {
    FB.logout(function () {

    });
}

function play_win() {
	var audio = new Audio('audio/FANFARE.wav');
	audio.play();
}

function play_lose() {
	var audio = new Audio('audio/ACCDENT.wav');
	audio.play();
}

function play_1() {
	var audio = new Audio('audio/ping.wav');
	audio.play();
}
