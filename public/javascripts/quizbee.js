
$(document).ready(function(){
  document.querySelector('input[name="choices"]:checked');
  const runOnce = sessionStorage.getItem("runOnce");
  if(runOnce === null) {
    $("#modalInstruction").modal('show');
    sessionStorage.setItem("runOnce", 1)
  } else {
    $("#modalInstruction").modal('hide');
  }

  const save_match = sessionStorage.getItem("match");
  const save_items = sessionStorage.getItem("items");
  const save_wrong = sessionStorage.getItem("wrong");
  const save_percent = sessionStorage.getItem("percent");

  if (save_match !== null && save_items !== null && save_wrong !== null && save_percent !== null) {
    //console.log("not null");
    document.querySelector(
      "#score-item"
    ).innerHTML = `${save_match}/${save_items}`;
    document.querySelector("#wrong").innerHTML = `${save_wrong}`
    document.querySelector("#percent").innerHTML = `${save_percent}%`
  } else {
    //console.log("null");
    document.querySelector("#score-item").innerHTML = "0/0";
    document.querySelector("#wrong").innerHTML = "0";
    document.querySelector("#percent").innerHTML = "0";
    sessionStorage.setItem("match", 0);
    sessionStorage.setItem("items", 0);
    sessionStorage.setItem("wrong", 0);
    sessionStorage.setItem("percent", 0);
  }
});

history.pushState(null, null, location.href);
window.onpopstate = function () {
  sessionStorage.clear();
  history.back();
};

function userShowAnswer() {
  const new_match = sessionStorage.getItem("match");
  const new_items = sessionStorage.getItem("items");
  const n_items = parseInt(new_items) + 1;

  sessionStorage.setItem("items", n_items);
  sessionStorage.setItem("percent", percentage(new_match, n_items));
  window.location.reload();   

}

$('#checkAnswer').click(function() {
  if ($('input[name="choices"]:checked').length > 0) {
    const correct = document.querySelector("#correct").textContent;
  const answer = document.querySelector('input[name="choices"]:checked').value;

  const new_match = sessionStorage.getItem("match");
  const new_items = sessionStorage.getItem("items");
  const new_wrong = sessionStorage.getItem("wrong");

  if (answer === correct) {
    const n_match = parseInt(new_match) + 1;
    const n_items = parseInt(new_items) + 1;

    sessionStorage.setItem("match", n_match);
    sessionStorage.setItem("items", n_items);

    sessionStorage.setItem("percent", percentage(n_match, n_items));
    window.location.reload();  
  } else {
   
    //console.log("wrong");
    const n_items = parseInt(new_items) + 1;
    const n_wrong = parseInt(new_wrong) + 1;
    sessionStorage.setItem("items", n_items);
    sessionStorage.setItem("wrong", n_wrong);

    sessionStorage.setItem("percent", percentage(new_match, n_items));
    
    
    if (n_wrong !== 5) {
      $('#modalIncorrect').modal('show');
      setTimeout(() => {
        window.location.reload();
        
      }, 700);
      
    } else {
      $('#modalGameOver').modal('show');
    
      
    }
  }
  } else {
    $('#modalNoSelection').modal('show');
  
  }
});

function percentage(partialValue, totalValue) {
  return Math.round((100 * partialValue) / totalValue);
} 

function userQuit() {
  const categoryStyle = document.querySelector("#categoryStyle").innerHTML;
  const category = document.querySelector("#category").innerHTML;
  
  if(categoryStyle === "false") {
    insertHistory(category);
  } else {
    insertHistory("Random")
  }
}

function insertHistory(category) {
  const user = document.querySelector("#user").innerHTML;
  const {todayDate, todayTime} = getDateTime();
  const percentage = document.querySelector("#percent").innerHTML;
  const score_item = document.querySelector("#score-item").innerHTML;
  const score = score_item.substr(0,score_item.indexOf("/"));
  const items = score_item.substr(score_item.indexOf("/")+1, score_item.length);
  //console.log(`${score} : ${items} ${todayDate} ${todayTime}`);
  console.log('Inser first');
  fetch('/account/data', {
    
    method: 'POST',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    body: `user=${user}&date=${todayDate}&time=${todayTime}&items=${items}&correct_ans=${score}&category=${category}&h_stat=${percentage}`
    
  })
    //.then(res =>res.json())
  .then(res => {
    console.log('Update Second');
      fetch('/update/stat', {
        method: 'POST',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        },
        body: `user=${user}`
      })
      .then(res => {
        sessionStorage.clear();
        window.location = '/home';
      })
      
  })
}

function getDateTime() {
  const objToday = new Date(),
	dayOfMonth = objToday.getDate();
	months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'),
	curMonth = months[objToday.getMonth()],
	curYear = objToday.getFullYear(), 
  curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours()),
  curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes(),
  curMeridiem = objToday.getHours() > 12 ? "PM" : "AM";
  const todayTime = `${curHour}:${curMinute} ${curMeridiem}`;
  const todayDate = `${curMonth} ${dayOfMonth}, ${curYear}`; 
  return {todayTime, todayDate};
}



