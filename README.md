Expands the context menu (right clicking) whenever text is selected in Google Chromium based browsers.
Users can expand the context menu by creating or updating the items, which are stored in localStorage. 

Each item has a name, which is the text of the item in the context menu, aswell as a url. 
When the item is clicked, a new tab will open with the specified url + the selected text on the page. 

Usecase: 

A user wants to search Youtube for the selected text. 
He creates an object with a name ("Search Youtube") and an url (https://www.youtube.com/results?search_query=).
If the user has selected "bassguitar" and clicks the corresponding "Search Youtube" item menu, he will be sent to "https://www.youtube.com/results?search_query=bassguitar".
