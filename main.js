//ローカルストレージから値を取得　→　出力エリアに日付と時間を出力するための関数
let getStorageText = function(){
    let get = localStorage.getItem('obj');
    get = JSON.parse(get);

    if (get == null) return;
   
    for (let i = 0; i < get.length; i++){
        let idx = get[i];
        let day = idx.day;
        let hour = idx.hour;
        let obj = {
            day: day,
            hour: hour
        };
        //出力関数を実行
        addText(day,hour);
    }
}

//ローカルストレージから取得して表示エリアへ出力する関数(①ボタンクリック時、ページ読み込み時)
 let readList = function(){
    //表示エリアをクリア
    document.getElementById('add-d').innerHTML = '';
    document.getElementById('add-t').innerHTML = '';

    //ローカルストレージから値を取得　→　出力エリアに日付と時間を出力するための関数を実行
    getStorageText();
}


//配列をローカルストレージに保存する関数
function saveStorage(key,array){
    localStorage.setItem('obj',JSON.stringify(array));
}

//①で取得した値を配列に入れる関数
let arraySort = [];
let createArray = function(outDay,outTime){

    //オブジェクトに入れて日付(day)の降順でソート
    let obj = {
        day : outDay,
        hour : outTime,
    };
    arraySort.push(obj);
    arraySort = arraySort.sort(function(a,b){
        return (a.day < b.day) ? -1 : 1;
    });

    //日付を「YYYY-MM-DD」から「年月日」形に変換
    let arrayObj = [];
    for (let i = 0; i < arraySort.length ; i++){
        let idx = arraySort[i];
        let day = idx.day;
        let hour = idx.hour
        //日付を変換
        day = new Date(day).toLocaleString('ja-jp', {
            dateStyle: 'long'
        })
        //再度オブジェクト形式にする
        let obj = {
            day: day,
            hour: hour
        };
        arrayObj.push(obj);
    };
    
    //配列をローカルストレージに保存する関数を実行
    saveStorage('key',arrayObj);
}


//ローカストレージから取得した値を表示エリアへの出力する関数
    function addText(outDay,outTime) {   

    //出力用の要素を作成 →　取得した値（日付、時間）を入れる
    const newDayContent = document.createElement('tr').textContent = outDay;
    const newTimeContent = document.createElement('tr');
    newTimeContent.textContent = outTime;

    //作成した要素を表示エリアに表示させる
    document.getElementById('add-d').append(newDayContent);         
    const outContentT = document.getElementById('add-t').append(newTimeContent);
}

//チャートの設定関数
function createChart(day,hour){
    const ctx = document.getElementById('chart1').getContext('2d');
        window.charts = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: day,
                datasets: [{
                    data: hour
            }]
        }
    }) 
}

//②チャート作成用の関数
function getStorageChart(){

    let arrayDay = [];
    let arrayHour = [];

    //ローカルストレージから値(JSON文字列)を取得し、JavaScriptオブジェクトに変換
    getStorage = localStorage.getItem('obj');
    getStorage = JSON.parse(getStorage);

    //オブジェクトから「日時」「時間」の配列を作る
    if (getStorage == null) return;
    for (let i = 0; i < getStorage.length; i++){
        let getObj = getStorage[i];
        let day = getObj.day;
        let hour = getObj.hour;
        arrayDay.push(day);
        arrayHour.push(hour);
    }
    
    //チャートを設定する関数を実行
    createChart(arrayDay,arrayHour);
}


//------イベントハンドル-------//

//①時間を登録ボタンクリック
document.getElementById('create').addEventListener('click', function(){
    
    //入力フォームから値を取得
    let inputDay = document.getElementById('input-d').value;
    let inputTime = document.getElementById('input-t').value;  

        //入力値チェック
        if (inputDay == "") {
            alert("日付は必須です");
            return;
        } 

        if (inputTime == "") {
            alert("時間は必須です")
            return;
        } else if(inputTime.match(/[^0-9.]/g)){
            alert("時間は半角数字と「.」で入力してください")
            return;
        }

    //取得した値を配列に入れる関数を実行
    createArray(inputDay,inputTime);

    //表示エリアへの出力の関数を実行
    readList();
    
})

//②「グラフに表示」ボタンクリック
document.getElementById('out').addEventListener('click', function(){
    //チャートのインスタンスをリセット
    if (typeof charts !== 'undefined' && charts) {
         charts.destroy();
    }

    //ローカルストレージから値を取得する関数を実行
    getStorageChart()
    
});

//③「リセット」ボタンクリック
document.getElementById('clear').addEventListener('click', function(){
    //入力エリアの入力値をクリア
    document.getElementById('input-d').value = '';
    document.getElementById('input-t').value = '';

    //表示エリアの出力値をクリア
    document.getElementById('add-d').innerHTML = '';
    document.getElementById('add-t').innerHTML = '';

    //ローカルストレージをクリア
    localStorage.removeItem('obj');
    window.location.reload();
});

//ページ読み込み時にローカルストレージに保存されているデータのグラフを描画させる関数実行
readList();
getStorageChart();
