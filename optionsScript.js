let options;

// Allow the user to add options and save those to localstorage
chrome.runtime.sendMessage({message: "getOptions"}, response => {
  if(response.message === "success"){
    options = response.payload;
    updateTable();
  }
})

function saveOptions(){
  chrome.runtime.sendMessage({
    message: "setOptions",
    payload: options,
  }, response => {
    if(response.message === "success"){
      console.log("Options have been succesfully saved");
      updateTable();
    }
  });
}


function updateTable(){
  let {items} = options;
  let tableBody = document.querySelector("#optionsTableBody");
  // Reset table
  tableBody.innerHTML = ""
  for(item of items){
    // Create elements
    const row = document.createElement("tr");

    const itemTextData = document.createElement("td");
    const itemUrlData = document.createElement("td");
    const saveButtonData = document.createElement("td");
    const deleteButtonData = document.createElement("td");


    const itemText = document.createElement("input");
    const itemUrl = document.createElement("input");
    const saveButton = document.createElement("button");
    const deleteButton = document.createElement("button");
    // Fill elements with relevant data
    row.setAttribute("data-id", item.id);

    itemText.value = item.name;
    itemUrl.value = item.url;

    saveButton.textContent = "Save";
    deleteButton.textContent = "Delete";

    // Event listeners for the buttons
    saveButton.addEventListener("click", (e) => {
      // Select relevant elements
      const parent = e.target.parentElement.parentElement;
      const firstInput = parent.querySelector("input");
      const secondInput = firstInput.parentElement.nextSibling.querySelector("input");
      const id = "" + parent.dataset.id;
      // Get the item we want to change
      const itemToUpdate = options.items.find((item) => {
        return item.id === id;
      });
      console.log(options);
      console.log(id);
      console.log(parent);
      console.log(firstInput);
      console.log(secondInput);
      console.log(itemToUpdate);
      
      if(itemToUpdate){
        // Change the data
        itemToUpdate.name = firstInput.value;
        itemToUpdate.url = secondInput.value;
        // Save the date
        saveOptions();
      }
      else{
        console.log("item not found");
      }
    });

    deleteButton.addEventListener("click", (e) => {
      const id = e.target.parentElement.parentElement.dataset.id;
      // Filter out the items with the corresponding id
      options.items = options.items.filter((item) => {
        return item.id !== id;
      });
      saveOptions();
    });

    // Add elements to each other and the table
    itemTextData.appendChild(itemText);
    itemUrlData.appendChild(itemUrl);

    saveButtonData.appendChild(saveButton);
    deleteButtonData.appendChild(deleteButton);

    row.appendChild(itemTextData);
    row.appendChild(itemUrlData);
    row.appendChild(saveButtonData);
    row.appendChild(deleteButtonData);

    tableBody.appendChild(row);    
  }
  // Append row for new items
  tableBody.appendChild(createNewItemRow());
}

function createNewItemRow(){
  // Returns a new row where we can create new items
  let {idCounter} = options;
  // idCounter holds the latest used id

  // Create elements
  const newRow = document.createElement("tr");

  const itemTextData = document.createElement("td");
  const itemUrlData = document.createElement("td");
  const addButtonData = document.createElement("td");
  
  const itemText = document.createElement("input");
  const itemUrl = document.createElement("input");
  const addButton = document.createElement("button");

  // Add info the the elements

  newRow.setAttribute("data-id", idCounter + 1);
  addButton.textContent = "Add item";

  itemTextData.appendChild(itemText);
  itemUrlData.appendChild(itemUrl);

  addButtonData.appendChild(addButton);

  newRow.appendChild(itemTextData);
  newRow.appendChild(itemUrlData);
  newRow.appendChild(addButtonData);

  // Event listener
  addButton.addEventListener("click", (e) => {
    // Select relevant elements
    const parent = e.target.parentElement.parentElement;
    const firstInput = parent.querySelector("input");
    const secondInput = firstInput.parentElement.nextSibling.querySelector("input");
    const id = "" + parent.dataset.id;

    let newItem = {
      id,
      name: firstInput.value,
      url: secondInput.value,
    }
    options.items.push(newItem);
    options.idCounter++;
    saveOptions();
  })

  return newRow;

}