//웹서버 생성
process.on('uncaughtException', function (err) {
	console.log('Caught exception: ' + err);
 // 추후 trace를 하게 위해서 err.stack 을 사용하여 logging하시기 바랍니다.
 // Published story에서 beautifule logging winston 참조
});

var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server)

server.listen(4004);


//외부 파일 js 로드 하기
//앞의 gameCore 경로는 client page에서 찾는 경로이며
//뒤에 gameCore는 실제 js 파일이 있는 경로이다.
//만약 실 경로가 js 폴더이고 클라이언트에서 script/외부js파일 로 스크립트를 부른다면
// '/script',express.static(__dirname+'/js')); 같은 방식으로 설정해야한다.
app.use('/gameCore',express.static(__dirname+"/gameCore"));
app.use('/img',express.static(__dirname+"/img"));


// 라우팅
app.get('/', function (req, res) {
	res.sendfile(__dirname + '/client.html');
});

//비행기 이동 속도
//var speed = 5;
//총알 속도
var bspeed = 10;

//비행기 정보
var shipInfo = {};

//총알 정보
var bullets = {};

//총알 카운트
var bullet_num = 0;

var fps = parseInt(1000/60);

//클라이언트 연결이 들어왔을때
io.sockets.on('connection', function (socket) {
	//유저 기본 정보 초기화
	//아이디 생성
	socket.on('setShipInit',function(){
		var ship_length = Object.keys(shipInfo).length;
		console.log(ship_length);
		if(ship_length >= 8){
			console.log("go Main");
			socket.emit("returnMain");
		}
		else{

			var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
			var string_length = 5;
			var randomstring = '';
			for (var i=0; i<string_length; i++) {
				var rnum = Math.floor(Math.random() * chars.length);
				randomstring += chars.substring(rnum,rnum+1);
			}
			var id = randomstring;
			socket.emit("setid",id);

			//랜덤 기본 생성 좌표 가져오기
			var position = JSON.parse(shipRandomPos());

			console.log(id+" is connected");

			//비행기 정보 객체 만들기
			var data = new Object();
			socket.username = id;
			data['socket_id'] = socket.id;
			data['hp'] = 10;
			data['score'] = 0;
			data['angle'] = 0;
			data['x'] = position.x;
			data['y'] = position.y;
			data['old_angle'] = 0;
			data['old_x'] = position.x;
			data['old_y'] = position.y;

			shipInfo[id] = data;
			console.log(shipInfo);
		}
	});

	socket.on('moveShip',function(){
		socket.emit('getDegree');
		var speed = 6;
		var degree = shipInfo[socket.username].angle;
		var rad = degree * Math.PI/180;
		var yunits = Math.cos(rad) * speed;
		var xunits = Math.sin(rad) * speed;

		shipInfo[socket.username].angle = degree;
		shipInfo[socket.username].x = shipInfo[socket.username].x + xunits;
		shipInfo[socket.username].y = shipInfo[socket.username].y - yunits;

		//벽 충돌 시 지나가지 못하게
		if(shipInfo[socket.username].x >= 1010 ) shipInfo[socket.username].x = 1010;
		else if(shipInfo[socket.username].x <= 25) shipInfo[socket.username].x = 25;
		if(shipInfo[socket.username].y >= 1510) shipInfo[socket.username].y = 1510; 
		else if(shipInfo[socket.username].y <= 300) shipInfo[socket.username].y = 300;
	});

	socket.on('setDegree',function(degree){
		shipInfo[socket.username].angle = degree;
	});


	// 발사 버튼 누르는 순간 각도 세팅
	socket.on('setBullet', function(){
		//총알 오브젝트 갯수 구하기
		bullets[bullet_num] = ({
			"name" : socket.username,
			"angle" : shipInfo[socket.username].angle,
			"x" : shipInfo[socket.username].x+26,
			"y" : shipInfo[socket.username].y+29,
			"old_angle" : shipInfo[socket.username].angle,
			"old_x" : shipInfo[socket.username].x+26,
			"old_y" : shipInfo[socket.username].y+29
		});

		LoopBullet(bullet_num);
		bullet_num++;
	});



	function shipRandomPos(){
		var ranX = 0;
		var ranY = 0;
		var Pos;

		ranX = 		Math.floor( (Math.random() * (850 - 50 + 1)) + 50); //1-10 사이에 난수 발생
		ranY = 		Math.floor( (Math.random() * (1500 - 300 + 1)) + 300); //1-10 사이에 난수 발생

		Pos= '{"x": '+ranX+', "y": '+ranY+'}'; //추첨된 번호를 배열에 저장

		return Pos;
	}


	//총알 발사 루프
	var fireLoop ={};
	function LoopBullet(i){
		//총알 객체의 정보를 가져온다.
		var angle =	bullets[i].angle;
		var radians = angle * Math.PI / 180;
		var yunits = Math.cos(radians) * bspeed;
		var xunits = Math.sin(radians) * bspeed;

		fireLoop[i] = setInterval(function(){
			bullets[i].old_x = bullets[i].x;
			bullets[i].old_y = bullets[i].y;

			bullets[i].x = bullets[i].x + xunits;
			bullets[i].y = bullets[i].y - yunits;

			//충돌 체크
			hitChk(i);

			var obj_length = Object.keys(bullets).length;
			//console.log(obj_length);
			if(obj_length == 0) bullet_num = 0;

		}, 16);
	}

	socket.on('play', function(){
		//console.log(shipInfo);
		socket.emit('update', shipInfo, bullets);
	});

	///충돌처리
	function hitChk(i){
		
		if((bullets[i].x >= 1110 || bullets[i].x <= -10) || (bullets[i].y >= 1560 || bullets[i].y <= 310)) {
			delete bullets[i];
			clearInterval(fireLoop[i]);
		}
		else{
			for(key in shipInfo){
				
				if(key != socket.username){
					if(( bullets[i].x >= shipInfo[key].x && bullets[i].x <= shipInfo[key].x+58) &&
						(bullets[i].y >= shipInfo[key].y && bullets[i].y <= shipInfo[key].y+58)){
						shipInfo[key].hp = shipInfo[key].hp -1;
						console.log(key + " hit");
						console.log("now hp : "+shipInfo[key].hp);

						delete bullets[i];

						if(shipInfo[key].hp == 0){
							shipInfo[socket.username].score = shipInfo[socket.username].score+1;
							var socket_id = shipInfo[key].socket_id;
							console.log(socket_id);
							//특정 클라에게 메세지 보내기
							//socket->to로 변경됨
							io.sockets.to(socket_id).emit("gameover", key);
							delete shipInfo[key];
						}

						clearInterval(fireLoop[i]);
					}
				}
			}
		}

	}

	// 사용자가 접속을 끊을 경우 처리할 리스너 함수
	socket.on('disconnect', function(){

		// 사용자 목록을 관리하는 전역변수에서 해당 사용자를 삭제한다.
		delete shipInfo[socket.username];

		console.log(socket.username+" is out");
		console.log(shipInfo);
	});
});
