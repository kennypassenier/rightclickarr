let options = [];

chrome.runtime.sendMessage({message: "getOptions"}, response => {
  if(response.message === "success"){
    options = response.payload;
    let optionsList = document.querySelector("#optionsList");
    for(option of options){
      const li = document.createElement("li");
      li.textContent = option.name + " : " + option.url
      optionsList.appendChild(li);
    }
  }
})
