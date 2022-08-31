// Only runs after the extension is first installed
// We use it to init the objects we will be using from localStorage
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    options: {
      items: [
        {
          id: "1",
          name: "Add to movies",
          url: "http://localhost:7878/add/new/"
        },
        {
          id: "2",
          name: "Add to TV series",
          url: "http://localhost:8989/add/new/"
        }, 
        {
          id: "3",
          name: "Search Youtube", 
          url: "https://www.youtube.com/results?search_query="
        }, 
        {
          id: "4",
          name: "Search IMDB", 
          url: "https://www.google.com/search?q=imdb+"
        }
      ],
      idCounter: 3, // Make sure that this always corresponds with the amount of provided options
    }
  });
});

let options;
chrome.storage.local.get("options", data => {
  options = data.options;
});



chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Listen to the getOptions message
  if(request.message === "getOptions"){
    console.log("get options");
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
  else if(request.message = "setOptions"){
    console.log("set options");
    console.log(request.payload)
    chrome.storage.local.set({
      "options": request.payload,
    });
    if(chrome.runtime.lastError){
      sendResponse({
        message: "failed",
      })
      return true
    }
    // No errors
    sendResponse({
      message: "success",
    })
    // Update context menu
    options = request.payload;
    createContextItems();
  }
  return true;
});

chrome.contextMenus.onClicked.addListener((info) => {
  console.log(info);
  // Get the item from options that corresponds with the id of the contextmenu item
  const option = options.items.find((option) => {
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
  // Remove any that have been previously made so we can update properly
  chrome.contextMenus.removeAll();

  // Create context menu items
  chrome.storage.local.get("options", data => {
    // Check for errors
    if(chrome.runtime.lastError){
      console.log("There was an error");
    }
    // No errors
    for(let item of data.options.items){
      const obj = {
        id: item.id,
        title: item.name,
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
