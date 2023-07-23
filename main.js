let body = document.body;
let cta = document.getElementById("cta");

cta.addEventListener("click", () => {
  displayMessage("Submission Successfull!", "success");
});

function displayMessage(str, type) {
  let msgCard = document.createElement("div");
  msgCard.innerText = str;
  msgCard.classList.add("msg-card");
  if (type == "success") {
    msgCard.classList.add("success");
  } else if (type == "warning") {
    msgCard.classList.add("warning");
  }
  body.append(msgCard);
  setTimeout(function () {
    msgCard.style.display = "none";
    body.removeChild(msgCard);
  }, 2900);
}

// displayMessage('Testing Message','success');//Success message
// displayMessage('Testing Message','warning');//Error Message

// // Toggle Swtich Functionality
// let toggleBtn= document.querySelector('#toggle input[type="checkbox"]');

// toggleBtn.addEventListener('click',()=>{
//   if(toggleBtn.checked){
//     document.body.classList.add('light-mode');
//   }else{
//     document.body.classList.remove('light-mode');
//   }
// })