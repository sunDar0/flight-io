//이미지 객체 모음
var Imgs = new Object();
//버튼의 위치 찾기
var btnx;
var btny;
var nowStatus = "intro";// intro, main, play, over



var socket;


//버튼이 눌리고 있는중 인지 체크
var leftpush;
var rightpush;
var forwardpush;
var firepush;

var pressflag = false;


//우주선들의 좌표
var shipInfo = {};
var tmp_shipInfo = {};
var bullets = {};
var tmp_bullets = {};

var user_id;
//기체 배열
var shipImg = [];

var fps =1000/60;
// 방향
var degree;



function touchEvent(event){
	//e.changedTouches[0].pageX;
	//e.changedTouches[0].pageY;
	var canvas = $('#myCanvas');

	var canvasPosition = {
		x: canvas.offset().left,
		y: canvas.offset().top
	};

	var canvasSize = {
		width : $("#myCanvas").width(),
		height : $("#myCanvas").height()
	};



	if(event.type == "touchstart" || event.type == "touchend"){
		point = {
			x: event.changedTouches[0].pageX - canvasPosition.x,
			y: event.changedTouches[0].pageY - canvasPosition.y
		};
		console.log("touch");
		//alert("touch!!");
	}
	else{
		if(window.ontouchstart ===null){
			return;
		}
		point = {
			x: event.pageX - canvasPosition.x,
			y: event.pageY - canvasPosition.y
		};
		//console.log("click");
		//alert("click!!");
	}



	touchCanvas(canvasSize);
}

function on_key_down(event)
{
	if(event.keyCode == 32){
		touchBtn('FireBtn','mousedown');
	}
}

//이미지들 객체 형태로 만들기
function loadImg()
{
	Imgs = {//createImg(src,x,y) 함수부
		Logo: createImg( "img/logo.jpg", 0, 0 ),
		Main : {
			Title : createImg("img/game_title.png",0, 0),
			InputBox : createImg("img/name_input_bg.png",0, 0),
			PlayBtn : createImg("img/main_play_btn.png",0, 0),
			PlayBtnAct : createImg("img/main_play_btn_act.png",0, 0)
		},
		Play :{
			leftBtn : createImg("img/play_left_btn.png",0, 0),
			leftBtnAct : createImg("img/play_left_btn_act.png",0, 0),
			rightBtn : createImg("img/play_right_btn.png",0, 0),
			rightBtnAct : createImg("img/play_right_btn_act.png",0, 0),
			forwardBtn : createImg("img/play_forward_btn.png",0, 0),
			forwardBtnAct : createImg("img/play_forward_btn_act.png",0, 0),
			fireBtn : createImg("img/play_fire_btn.png",0, 0),
			fireBtnAct : createImg("img/play_fire_btn_act.png",0, 0),
			ship : {
				play_hp : createImg("img/player_hp_one_point.png",0,0),
				play1_idle : createImg("img/player1_idle.png",0,0),
				play1_top : createImg("img/player1_top.png",0,0),
				play1_bullet : createImg("img/player1_bullet.png",0,0),

				play2_idle : createImg("img/player2_idle.png",0,0),
				play2_top : createImg("img/player2_top.png",0,0),
				play2_bullet : createImg("img/player2_bullet.png",0,0),

				play3_idle : createImg("img/player3_idle.png",0,0),
				play3_top : createImg("img/player3_top.png",0,0),
				play3_bullet : createImg("img/player3_bullet.png",0,0),

				play4_idle : createImg("img/player4_idle.png",0,0),
				play4_top : createImg("img/player4_top.png",0,0),
				play4_bullet : createImg("img/player4_bullet.png",0,0),

				play5_idle : createImg("img/player5_idle.png",0,0),
				play5_top : createImg("img/player5_top.png",0,0),
				play5_bullet : createImg("img/player5_bullet.png",0,0),

				play6_idle : createImg("img/player6_idle.png",0,0),
				play6_top : createImg("img/player6_top.png",0,0),
				play6_bullet : createImg("img/player6_bullet.png",0,0),

				play7_idle : createImg("img/player7_idle.png",0,0),
				play7_top : createImg("img/player7_top.png",0,0),
				play7_bullet : createImg("img/player7_bullet.png",0,0),

				play8_idle : createImg("img/player8_idle.png",0,0),
				play8_top : createImg("img/player8_top.png",0,0),
				play8_bullet : createImg("img/player8_bullet.png",0,0)

			}
		}
	};
	shipImg[0] = [Imgs.Play.ship.play1_idle, Imgs.Play.ship.play1_bullet];
	shipImg[1] = [Imgs.Play.ship.play2_idle, Imgs.Play.ship.play2_bullet];
	shipImg[2] = [Imgs.Play.ship.play3_idle, Imgs.Play.ship.play3_bullet];
	shipImg[3] = [Imgs.Play.ship.play4_idle, Imgs.Play.ship.play4_bullet];
	shipImg[4] = [Imgs.Play.ship.play5_idle, Imgs.Play.ship.play5_bullet];
	shipImg[5] = [Imgs.Play.ship.play6_idle, Imgs.Play.ship.play6_bullet];
	shipImg[6] = [Imgs.Play.ship.play7_idle, Imgs.Play.ship.play7_bullet];
	shipImg[7] = [Imgs.Play.ship.play8_idle, Imgs.Play.ship.play8_bullet];



}

//이미지 리소스 불러오기
function createImg( src, x, y )
{
	var img = new Image( );
	img.setAttribute( "src", src );
	img.x = x;
	img.y = y;

	return img;
}
///

//개발사 로고 표시
function startIntro()
{
	canvas = $("#myCanvas")[0];
	//캔버스가 있다면
	if (canvas.getContext)
	{

		loadImg();
		ctx = canvas.getContext("2d");

		cnvsBuffer = document.createElement('canvas');
		ctxBuffer = cnvsBuffer.getContext('2d');
		ctxBuffer.canvas.width = canvas.width;
		ctxBuffer.canvas.height = canvas.height;


		Imgs.Logo.onload = function(){
			ctx.drawImage(Imgs.Logo,0,0);

		};

		//var lastUpdate = Date.now();
		//setInterval("doGameLoop()", 0);

    }
	//3초가 지나면 메인화면 부르기

	setTimeout(function(){
		startMainDisplay();
	 	doGameLoop( );
       	//a= new Date().getTime();
     },3000);
}

function startMainDisplay()
{
	//

	socket = io.connect("localhost:4004");
	// 서버에 접속할 때까지 대기 한다.
	socket.on('connect', function(){
		//메인화면 초기화
		ctxBuffer.fillStyle="#d9d9d9";
		ctxBuffer.fillRect(0,0,1080, 1920);
		//타이틀 그리기
		ctxBuffer.drawImage(Imgs.Main.Title, 540-(Imgs.Main.Title.width/2), Imgs.Main.Title.height);
		//인풋 박스 그리기
		//ctxBuffer.drawImage(Imgs.Main.InputBox, 540-(Imgs.Main.InputBox.width/2), 960);

		//플레이버튼 그리기
		btnx = 540-(Imgs.Main.PlayBtn.width/2);
		btny = 1210;
		ctxBuffer.drawImage(Imgs.Main.PlayBtn, btnx, btny);
		//메인화면 초기화 end
		nowStatus="main";
	});

	socket.on('update', function (ship, bullet) {

		shipInfo = ship;
		bullets = bullet;

		//console.log(bullets[0].x);
		//console.log(bullets[1].x);
	});

	socket.on('setid',function(data){
		sessionStorage.clear();
		sessionStorage.setItem("id", data);
		user_id = data;

	});

	socket.on('returnMain',function(){
		alert("사람이 가득 찼습니다. 잠시후 다시 시도해주세요.");
		document.location.reload();
		startMainDisplay();
	});

	socket.on('gameover',function(name){
		alert(name+" are GAME OVER!");
		document.location.reload();
	});

	socket.on('getDegree',function(){
		console.log(degree);
		socket.emit('setDegree',degree);
	});

}


//캔버스를 터치 했을 떄
function touchCanvas(canvasSize)
{
	//캔버스크기 리사이징
	var heightRatio = 1920/canvasSize.height;
	var widthRatio = 1080/canvasSize.width;

	//플레이 버튼 시작점과, 크기 너비 리사이징
	var playBtnStartX =btnx / widthRatio;
	var playBtnStartY =btny / heightRatio;
	var playBtnWidth = playBtnStartX+(Imgs.Main.PlayBtn.width / widthRatio);
	var playBtnHeight = playBtnStartY+(Imgs.Main.PlayBtn.height / heightRatio);

	var padx = 170;
	var pady = 1750;
	var point_x = point.x * widthRatio;
	var point_y = point.y * heightRatio;



	//발사 버튼
	var fireBtnStartX =((Imgs.Play.leftBtn.width*2)+(30*3)) / widthRatio;
	var fireBtnStartY =1750 / heightRatio;
	var fireBtnWidth = fireBtnStartX + (Imgs.Play.forwardBtn.width / widthRatio);
	var fireBtnHeight = fireBtnStartY + (Imgs.Play.forwardBtn.height / heightRatio);

	/*
	console.log("Clicked");
	console.log("mouse x : "+mouse.x);
	console.log("mouse y : "+mouse.y);
	console.log("mouse leftBtnStartX : "+leftBtnStartX);
	console.log("mouse leftBtnStartY : "+leftBtnStartY);
	console.log("mouse rightBtnStartX : "+rightBtnStartX);
	console.log("mouse rightBtnStartY : "+rightBtnStartY);
	*/


	switch (nowStatus){
		case "main":
			if((point.x >= playBtnStartX  && point.x<= playBtnWidth) && (point.y >= playBtnStartY && point.y <= playBtnHeight)){
				//console.log(event.type);
				touchBtn("PlayBtn", event.type);
			}
			else{
				if(event.type == "mouseup"){
					btnx = 540-(Imgs.Main.PlayBtnAct.width/2);
					btny = 1210;
					ctxBuffer.drawImage(Imgs.Main.PlayBtn, btnx, btny);
				}
			}
		break;
		case "play":

			var dx = point_x - padx;
			var dy = point_y - pady;
			var px = Math.pow(dx,2);
			var py = Math.pow(dy,2);

			var dis = Math.sqrt(px+py);

			if(dis<120){

				//이벤트 타입, 거리, 각도 매개변수로 넘기기
				var rad = Math.atan2(dx,dy);
				degree = (rad*180)/Math.PI;
				//console.log(degree % 180);
				degree = Math.floor(180+((degree > 0) ? (-1 * degree) : -1 * degree));
				touchPad(event.type, degree, point_x, point_y);
				//touchBtn("touchPad",event.type);
			}
			else{
				if(event.type == "mouseup"){
					clearInterval(forwardpush);
					pressflag = false;

					ctxBuffer.beginPath();
					ctxBuffer.arc(170, 1750, 150, 0, 2 * Math.PI, false);
					ctxBuffer.fillStyle = 'white';
					ctxBuffer.fill();
					ctxBuffer.closePath();

					ctxBuffer.beginPath();
					ctxBuffer.arc(170, 1750, 15, 0, 2 * Math.PI, false);
					ctxBuffer.fillStyle = 'black';
					ctxBuffer.fill();
					ctxBuffer.closePath();
				}

			}



			if((point.x >= fireBtnStartX  && point.x<= fireBtnWidth) && (point.y >= fireBtnStartY && point.y <= fireBtnHeight)){
				//console.log(event.type);
				touchBtn("FireBtn", event.type);


			}

			else{
				if(event.type == "mouseup"){
					btnx = Imgs.Play.rightBtn.width*2+30*3;
					btny = 1750;
					ctxBuffer.drawImage(Imgs.Play.fireBtn, btnx, btny);
				}
			}
		break;
	}
}



var fireflag = true;
function touchBtn(name,e_type)
{

	switch(name){
		case "PlayBtn":
			btnx = 540-(Imgs.Main.PlayBtnAct.width/2);
			btny = 1210;

			if(e_type=='mousedown' || e_type=='touchstart'){
				ctxBuffer.drawImage(Imgs.Main.PlayBtnAct, btnx, btny);
			}
			else if(e_type =='mouseup' || e_type=='touchend'){
				ctxBuffer.drawImage(Imgs.Main.PlayBtn, btnx, btny);

				//스테이지
				ctxBuffer.fillStyle="#d9d9d9";
				ctxBuffer.fillRect(0,0,1080, 1720);
				//상단 배너와 이름 표시
				ctxBuffer.fillStyle="#fffff0";
				ctxBuffer.fillRect(0,0,1080, 300);
				//하단 버튼 배치
				ctxBuffer.fillStyle="#000000";
				ctxBuffer.fillRect(0,1570,1080, 400);

				ctxBuffer.beginPath();
				ctxBuffer.arc(170, 1750, 150, 0, 2 * Math.PI, false);
      			ctxBuffer.fillStyle = 'white';
      			ctxBuffer.fill();
				ctxBuffer.closePath();

				ctxBuffer.beginPath();
				ctxBuffer.arc(170, 1750, 15, 0, 2 * Math.PI, false);
      			ctxBuffer.fillStyle = 'black';
      			ctxBuffer.fill();
				ctxBuffer.closePath();


				//ctxBuffer.drawImage(Imgs.Play.leftBtn, 30*1, 1750);
				//ctxBuffer.drawImage(Imgs.Play.rightBtn, Imgs.Play.leftBtn.width+30*2, 1750);
				ctxBuffer.drawImage(Imgs.Play.fireBtn, (Imgs.Play.leftBtn.width*2)+30*3, 1750);
				//ctxBuffer.drawImage(Imgs.Play.forwardBtn, (Imgs.Play.leftBtn.width*3)+30*4, 1750);
				socket.emit('setShipInit');
				nowStatus = "play";
			}

		break;

		case "FireBtn":
			btnx = Imgs.Play.rightBtn.width*2+30*3;
			btny = 1750;
			ctxBuffer.drawImage(Imgs.Play.fireBtn, btnx, btny);

			if(e_type=='mousedown' || e_type=='touchstart'){
				ctxBuffer.drawImage(Imgs.Play.fireBtnAct, btnx, btny);
				socket.emit('setBullet');
			}
		break;

		default:

		break;

	}

	//console.log(nowStatus);
}

function touchPad(e_type, degree, point_x, point_y){

	ctxBuffer.beginPath();
	ctxBuffer.arc(170, 1750, 150, 0, 2 * Math.PI, false);

	if(e_type =='mousedown' || e_type =='touchstart'){
		pressflag = true;
		ctxBuffer.fillStyle = 'grey';
		ctxBuffer.fill();
		ctxBuffer.closePath();

		ctxBuffer.beginPath();
		ctxBuffer.arc(point_x, point_y, 30, 0, 2 * Math.PI, false);
		ctxBuffer.fillStyle = 'white';
		ctxBuffer.fill();
		ctxBuffer.closePath();

		forwardpush = setInterval(function(){
	//		console.log("클릭 시 각도 : "+degree);
			socket.emit("moveShip");
		},16);
	}

	else if(e_type == "mouseup" || e_type =='touchend'){
		pressflag = false;

		ctxBuffer.fillStyle = 'white';
		ctxBuffer.fill();
		ctxBuffer.closePath();

		ctxBuffer.beginPath();
		ctxBuffer.arc(170, 1750, 15, 0, 2 * Math.PI, false);
		ctxBuffer.fillStyle = 'black';
		ctxBuffer.fill();
		ctxBuffer.closePath();

		clearInterval(forwardpush);
	}
	else if(pressflag == true && (e_type == "mousemove" || e_type =='touchmove')){
		ctxBuffer.fillStyle = 'grey';
		ctxBuffer.fill();
		ctxBuffer.closePath();

		ctxBuffer.beginPath();
		ctxBuffer.arc(point_x, point_y, 30, 0, 2 * Math.PI, false);
		ctxBuffer.fillStyle = 'white';
		ctxBuffer.fill();
		ctxBuffer.closePath();

	}

	//console.log(e_type + " 현재 각도 : "+degree);


/*if(
		console.log(pressflag);
		socket.emit("moveShip",dis, degree);
	}*/

	/*if(e_type=='mousedown' || e_type=='touchstart'){
		//console.log("dis : "+ dis);
		//console.log("degree : "+degree);
		ctxBuffer.fillStyle = 'grey';
		ctxBuffer.fill();
		ctxBuffer.closePath();

		console.log(mouse_x);
		console.log(mouse_y);

		ctxBuffer.beginPath();
		ctxBuffer.arc(mouse_x, mouse_y, 30, 0, 2 * Math.PI, false);
		ctxBuffer.fillStyle = 'white';
		ctxBuffer.fill();
		ctxBuffer.closePath();


		forwardpush = setInterval(function(){
			socket.emit("moveShip",dis, degree);
		});
	}
	else if(e_type =='mouseup' || e_type =='touchend'){
		clearInterval(forwardpush);
		ctxBuffer.fillStyle = 'white';
		ctxBuffer.fill();
		ctxBuffer.closePath();

		ctxBuffer.beginPath();
		ctxBuffer.arc(170, 1750, 15, 0, 2 * Math.PI, false);
		ctxBuffer.fillStyle = 'black';
		ctxBuffer.fill();
		ctxBuffer.closePath();

	}*/


}



function startPlayMain()
{

	//좌표 그리기
	var cnt = 1;
	//스테이지
	ctxBuffer.fillStyle="#d9d9d9";
	ctxBuffer.fillRect(0,296,1080, 1280);



	$.each(shipInfo, function(key, value) {
		//sessionStorage.setItem("id", randomstring);

		//console.log(key);
		//console.log(value.x+", "+value.y);
		//console.log(value.old_x+","+value.old_y);
		//console.log(value.angle);
		$.each(bullets, function(user, bullet) {
			ctxBuffer.fillStyle="#d9d9d9";
			//ctxBuffer.fillRect(bullet.old_x, bullet.old_y, 8, 8);

			if(bullet.name == sessionStorage.getItem("id")){
				//console.log(bullet);
				ctxBuffer.drawImage(shipImg[0][1], bullet.x, bullet.y);
			}
			else{
				ctxBuffer.drawImage(shipImg[cnt][1], bullet.x, bullet.y);
			}
		});

		//ctxBuffer.fillStyle="#d9d9d9";
		//ctxBuffer.fillRect(value.old_x-14, value.old_y, 72, 72);


		ctxBuffer.save();
		ctxBuffer.translate(value.x+29, value.y+29);
		ctxBuffer.rotate(value.angle*Math.PI/180);
		ctxBuffer.translate(-value.x-29, -value.y-29);

		//ctxBuffer.fillStyle="#d9d9d9";
		//ctxBuffer.fillRect(value.old_x-14, value.old_y, 72, 62);


		if(key == sessionStorage.getItem("id")){

			ctxBuffer.drawImage(shipImg[0][0], value.x,value.y);
		}
		else{
			ctxBuffer.drawImage(shipImg[cnt][0], value.x,value.y);
		}

		ctxBuffer.restore();


		ctxBuffer.fillStyle="black";
		ctxBuffer.font="50px Georgia";
		var score = shipInfo[user_id].score;
		ctxBuffer.fillText("KILL : "+score,800, 350);
		var hp = shipInfo[key].hp;
		for(var i=0;i<hp; i++){
			ctxBuffer.drawImage(Imgs.Play.ship.play_hp, value.x-14, (value.y+52)-(i*5));
		}

		cnt++;
	});
}


function startMain()
{
	ctxBuffer.fillStyle="#d9d9d9";
	ctxBuffer.fillRect(0,0,1080, 1720);

	ctxBuffer.fillStyle="#fffff0";
	ctxBuffer.fillRect(0,0,1080, 300);
}

/*function doGameLoop()
{
	switch(nowStatus){
		case "main" :
		break;

		case "play" :

			socket.emit('play');
			startPlayMain();
		break;

	}
	ctx.drawImage(cnvsBuffer,0,0);

}*/

var fps = 60; //Frame Per Second
var now; //지금 시간 계속 바뀌는
var then = Date.now( ); //
var interval = 1000 / fps;
var delta;
var b;
var a;
var aa = 0;
var Animation;

function doGameLoop()
{
	Animation = requestAnimationFrame( doGameLoop, canvas ); //함수 내에서 계속 재귀 호출

	b= new Date().getTime();
    if( aa++ % 60 == 0 )
    {
        a = b;
    }

	switch(nowStatus){
		case "main" :
			ctx.drawImage(cnvsBuffer,0,0);
		break;
		case "play" :
			now = Date.now( );
			delta = now - then;
			//startMain();
			if( delta > interval )
			{//특정 조건을 만족할 떄 함수 실행
				socket.emit('play');
				startPlayMain();
				ctx.drawImage(cnvsBuffer,0,0);
				then = now - ( delta % interval );
				//console.log(then);
			}
		break;
	}

}
