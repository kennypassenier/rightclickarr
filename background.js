// Only runs after the extension is first installed
// We use it to init the objects we will be using from localStorage
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    options: [
      {
        id: "1",
        name: "Add to movies",
        url: "http://localhost:7878/add/new?newItem="
      },
      {
        id: "2",
        name: "Add to TV series",
        url: "http://localhost:8989/add/new?newItem="
      }, 
      {
        id: "3",
        name: "Search Youtube", 
        url: "https://www.youtube.com/results?search_query="
      }
    ],
  });
});

let options = [];
chrome.storage.local.get("options", data => {
  options = data.options;
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Listen to the getOptions message
  if(request.message === "getOptions"){
    // Return the relevant data
    chrome.storage.local.get("options", data => {
      // Check for errors
      if(chrome.runtime.lastError){
        sendResponse({
          message: "failed",
          payload: [],
        })
        return true
      }
      // No errors
      options = data.options;
      sendResponse({
        message: "success",
        payload: options,
      })
    })
    return true;
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log(info);
  // Get the item from options that corresponds with the id of the contextmenu item
  const option = options.find((option) => {
    return option.id === info.menuItemId;
  });
  console.log(option);
  if(option){
    const url = option.url + info.selectionText;
    chrome.tabs.create({ url });
  }
  else{
    console.log("No option has been defined");
  }
  

})

function createContextItems(){
  console.log('Creating context items');
  // Create context menu items
  chrome.storage.local.get("options", data => {
    // Check for errors
    if(chrome.runtime.lastError){
      console.log("There was an error");
    }
    // No errors
    for(let option of data.options){
      const obj = {
        id: option.id,
        title: option.name,
        contexts: ["selection"],
      }
      chrome.contextMenus.create(obj);  
    }
  })
}


function onRequest(info, tab){
  let selection = info.selectionText;
  console.log(selection);

}


createContextItems();

//let tab = await chrome.tabs.create({ url });
