//이미지 객체 모음
var Imgs = new Object();
//버튼의 위치 찾기
var btnx;
var btny;
var nowStatus = "intro";// intro, main, play, over

//내 우주선의 좌표
var ship_px = 500;
var ship_py = 500;
var ship_angle = 0;

var shipInfo = [];
var socket;


//버튼이 눌리고 있는중 인지 체크
var btnpush;

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
				play_hp : createImg("img/player_hp.png",0,0),
				play1_idle : createImg("img/player1_idle.png",0,0),
				play1_top : createImg("img/player1_top.png",0,0),
				play1_bullet : createImg("img/player1_bullet.jpg",0,0)
				
			}
		}
	};
}

function shipRotate(){
	ship_angle = ship_angle+7;

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
	cnvsBuffer = document.createElement('canvas');
    	
	//캔버스가 있다면
	if (canvas.getContext)
	{
		loadImg();
		ctx = canvas.getContext("2d");
		cnvsBuffer = document.createElement('canvas');
  		ctxBuffer = cnvsBuffer.getContext('2d');
    	ctxBuffer.canvas.width = canvas.width;
    	ctxBuffer.canvas.height = canvas.height;
		
		Imgs.Play.ship.play1_bullet.onload = function(){
			setInterval("doGameLoop()",33);
		};
		
    }
	
	//3초가 지나면 메인화면 부르기
	//setTimeout("startMainDisplay()",3000);
}

function startPlayMain()
{
		
	ctxBuffer.fillStyle="#d9d9d9";
	ctxBuffer.fillRect(0,0,1080, 1720);
	
	ctxBuffer.fillStyle="#ffff12";
	ctxBuffer.fillRect(0,0,1080, 300);
}


// 우주선 만들기
function makeShip()
{
	
	//requestAnimationFrame(makeShip);
	ctxBuffer.save();
	ctxBuffer.translate(ship_px+29, ship_py+29);
	ctxBuffer.rotate(ship_angle * Math.PI/180);
	ctxBuffer.translate(-ship_px-29, -ship_py-29);
	ctxBuffer.drawImage(Imgs.Play.ship.play1_idle,ship_px,ship_py);
	ctxBuffer.drawImage(Imgs.Play.ship.play_hp, ship_px-10, ship_py);
	ctxBuffer.restore();
	
	
}

	
		
function doGameLoop()
{
	ship_angle = ship_angle+5;
	ship_py = ship_py+5;
	
	//console.log("gameloop");
	
	startPlayMain();
	makeShip();
	
	ctx.drawImage(cnvsBuffer, 0, 0);

}

