let data;
let model;
let xs, ys;
let labelP;
let lossP;



let labelList = [
    'Hệ thống thông tin',
    'Công nghệ phần mềm',
    'Mạng máy tính'
  ];

  function preload() {
    data = loadJSON('data.json');
  }

  function setup(){

    let marks = [];
    let labels = [];

    for (let record of data.entries) {
        let col = [record.nmlt / 10, record.ctdl / 10, record.csdl / 10, record.heqt / 10, record.mmt /10, record.ktlt / 10, record.ktmt /10];
        marks.push(col);
        labels.push(labelList.indexOf(record.cn));
      }

    xs = tf.tensor2d(marks);
      //console.log(xs);
    let labelTensor = tf.tensor1d(labels, 'int32');
    ys = tf.oneHot(labelTensor, 3);
    labelTensor.dispose();
    console.log(ys.shape);
    console.log(xs.shape);
    xs.print();
    ys.print();

    //Create model

    model = tf.sequential();
    let hidden = tf.layers.dense({
        units: 16,
        activation: 'sigmoid',
        inputDim: 7,
    });

    let output = tf.layers.dense({
        units: 3,
        activation: 'softmax',
    });

    model.add(hidden);
    model.add(output);

    //Create an optimizer
    const lr = 0.2;
    const optimizer = tf.train.sgd(lr);

    model.compile({
        optimizer: optimizer,
        loss: 'categoricalCrossentropy'
    });

    train().then(result => console.log(result.history.loss));

    let getResultBtn = document.getElementById('getResult');
        getResultBtn.addEventListener('click', function(){
      let speedText = document.getElementById('inputNMLT');
      let shootText = document.getElementById('inputCTDL');
      let passText = document.getElementById('inputCSDL');
      let dribText = document.getElementById('inputHEQT');
      let defText = document.getElementById('inputMMT');
      let phyText = document.getElementById('inputKTLT');
      let ktmt = document.getElementById('inputKTMT');

      
      let speed = speedText.value;
      let shoot = shootText.value;
      let pass = passText.value;
      let drib = dribText.value;
      let def = defText.value;
      let phy = phyText.value;
      let ktmtt = ktmt.value;


      if(speed === '' || shoot ==='' || pass ==='' || drib === '' || def ==='' || phy ==='' || ktmtt ===''){
        alert('Khong duoc de trong !')
        return;
      }
      if(speed > 10 || shoot > 10 || pass > 10 || drib > 10 || def > 10 || phy > 10 || ktmtt > 10){
        alert('Diem khong the lon hon 10!')
        return;
      }
      if(speed === 0 || speed < 4){
        speed =4;
      }
      if(shoot === 0 || shoot < 4){
        shoot =4;
      }
      if(pass === 0 || pass <4){
        pass =4;
      }
      if(drib === 0 || drib <4){
        drib =4;
      }
      if(def === 0 || def <4){
        def =4;
      }
      if(phy === 0 || phy <4){
        phy =4;
      }
      if(ktmtt === 0 || ktmtt <4){
        ktmtt =4;
      }
      const result = tf.tensor2d([
        [speed /10 , shoot /10 , pass / 10, drib / 10, def / 10, phy / 10, ktmtt/10]
      ]);

      //du doan
      let results = model.predict(result);
      let index = results.argMax(1).dataSync()[0];
      let label = labelList[index];
      alert('Chuyen nganh phu hop: ' +label)
})}

  async function train(){
    var percent = document.getElementById('percent');
    const options = {
      epochs : 1000,
      validationSplit: 0.01,
      shuffle: true,
      callbacks: {
        onTrainBegin: () => console.log('Training Start'),
        onTrainEnd: () => {hithere()},
        onEpochEnd: (nums, logs) =>{
          console.log('Epoch: '+ nums);
          console.log('Loss:'+ logs.loss);
          var per = ((parseInt(nums+2)) / 10 );
          percent.innerHTML = per + '%';
        }
      }
    }
    return await model.fit(xs, ys, options);
  }
  function hithere(){
    var pre = document.getElementById("preloader");
    var body = document.getElementById("body");
    pre.style.display = 'none';
    body.style.background = "url('ed.jpg')";
    body.style.backgroundPosition = 'center';
    body.style.backgroundSize = '115%';
    body.style.backgroundRepeat = 'no-repeat';
    console.log('Training Finished');
    alert('Data processed!');
    
  }
  //
  function fun_AllowOnlyAmountAndDot(txt)
        {
            if(event.keyCode > 47 && event.keyCode < 58 || event.keyCode == 46)
            {
               var txtbx=document.getElementById(txt);
               var amount = document.getElementById(txt).value;
               var present=0;
               var count=0;

               if(amount.indexOf(".",present)||amount.indexOf(".",present+1));
               {
              // alert('0');
               }

              /*if(amount.length==2)
              {
                if(event.keyCode != 46)
                return false;
              }*/
               do
               {
               present=amount.indexOf(".",present);
               if(present!=-1)
                {
                 count++;
                 present++;
                 }
               }
               while(present!=-1);
               if(present==-1 && amount.length==0 && event.keyCode == 46)
               {
                    event.keyCode=0;
                    //alert("Wrong position of decimal point not  allowed !!");
                    return false;
               }

               if(count>=1 && event.keyCode == 46)
               {

                    event.keyCode=0;
                    //alert("Only one decimal point is allowed !!");
                    return false;
               }
               if(count==1)
               {
                var lastdigits=amount.substring(amount.indexOf(".")+1,amount.length);
                if(lastdigits.length>=2)
                            {
                              //alert("Two decimal places only allowed");
                              event.keyCode=0;
                              return false;
                              }
               }
                    return true;
            }
            else
            {
                    event.keyCode=0;
                    //alert("Only Numbers with dot allowed !!");
                    return false;
            }

        }