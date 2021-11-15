shipPosition = function(t){
    var data= t.data;
    var today = (new Date()).getTime();

    while((new Date()).getTime() < today+8000){
        cnt++;
    }
    postMessage(cnt);
    //worker는 BOM, DOM 접근이 안됨
    //websocket 접근 가능
    //indexed DB 접근 가능
    //local storage 접근 가능
    //백엔드단 시간이 오래걸리는 작업은 worker가 전담
}