const ul = document.querySelector(".todos");
const formlist = document.querySelector("#inputsProvider");
const form = document.querySelector(".add");
const formBtn = form.querySelector("button");
let isEditMode = false;
//adding todos

form.addEventListener("submit", addingTodos);
function addingTodos(e) {
  e.preventDefault();
  const message = form.add.value.trim();
  if (message.length >= 1) {
    
    if(isEditMode){
      const itemToEdit = ul.querySelector('.edit-mode');
      removeItemFromStorage(itemToEdit.textContent);
      itemToEdit.classList.remove('edit-mode');
      itemToEdit.remove();
      isEditMode =false;
    }
    else{
      if(checkifItemPresent(message)){
        alert('Task Already Exists!');
        return;
      }
    }
    addItemToDom(message);
    addingItemToLocalStorage(message);
    ClearUi();
    form.reset();
  } else {
    window.alert("Need to Enter Atleast 1 letter to add as ToDo");
  }
}

// adding item to Dom
function addItemToDom(message) {
  /* We are checking our to do to contain atleast one letter */
  const format = `<li class="list-group-item d-flex justify-content-between align-items-center">
   <span><b>${message}</b></span>   
   <i class="fa fa-minus" aria-hidden="true"></i>
  </li>`;
  /*pencil : <i class="fas fa-pencil-alt"></i>*/
  ul.innerHTML += format;
}

// items adding to local storage by using JSON.Parse and JSON.stringify
function addingItemToLocalStorage(tasks) {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.push(tasks);

  localStorage.setItem("tasks", JSON.stringify(itemsFromStorage));
}
//getting items from storage
function getItemsFromStorage() {
  let itemsFromStorage;
  if (localStorage.getItem("tasks") === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem("tasks"));
  }
  return itemsFromStorage;
}

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((tasks) => addItemToDom(tasks));
  ClearUi();
}

//DELETING TODO
ul.addEventListener("click", OnClickItem);

function OnClickItem(e) {
  /*classList contains all the class information about the classes present inside it as thier child tags*/
  if (e.target.classList.contains("fa-minus")) {
    removeItem(e.target.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}

//creating function to EDIT
function setItemToEdit(task) {
  isEditMode = true;
  const ulInnerTags = document.querySelectorAll('li');

  ulInnerTags.forEach(i => i.classList.remove('edit-mode'));
  task.classList.add('edit-mode');
  formBtn.innerHTML = '<i class="fas fa-pencil-alt"></i><b>Update Item</b>';
  formBtn.style.backgroundColor = "#228B22";
  formlist.value = task.textContent.trim();  
}

function removeItem(task) {
  /*here we are removing parent element because delete class has i tag and we have to remove our li tag */
  task.remove();

  //removing fromLocal Storage
  removeItemFromStorage(task.textContent.trim());
  ClearUi();
}

//Removing items from Storage
function removeItemFromStorage(task) {
  let itemsFromStorage = getItemsFromStorage();
  
  itemsFromStorage = itemsFromStorage.filter((i) => i !== task);

  localStorage.setItem("tasks", JSON.stringify(itemsFromStorage));
}

//searching todo

const filterTodo = (info) => {
  Array.from(ul.children)
    .filter((todo) => !todo.textContent.toLowerCase().includes(info))
    .forEach((todo) => todo.classList.add("filtered"));
  Array.from(ul.children)
    .filter((todo) => todo.textContent.includes(info))
    .forEach((todo) => todo.classList.remove("filtered"));
};

const search = document.querySelector(".search input");

search.addEventListener("keyup", () => {
  const data = search.value.trim().toLowerCase();
  filterTodo(data);
});

//RemoveAll Button

const ClearAll = document.getElementById("ClearAll");
ClearAll.addEventListener("click", (e) => {
  e.preventDefault();
  if (confirm("Alert !!! All Tasks Will Be Cleared")) {
    ul.innerHTML = ''; //Emptying the unordered list
    localStorage.clear(); //clearing all data from localHost
    ClearUi();
  }
});


//checking duplicate items
function checkifItemPresent(task){
  const itemsFromStorage =getItemsFromStorage();
  return itemsFromStorage.includes(task);
}


//Maintaining ui

function ClearUi() {  
  
  const ulLengthfinder = ul.querySelectorAll("li");
  if (ulLengthfinder.length === 0) {
    search.style.display = "none";
    ClearAll.style.display = "none";
  } else {
    search.style.display = "block";
    ClearAll.style.display = "block";
  }

  formBtn.style.background='';
  formBtn.innerHTML = '<b>Add Item</b>';  
  
  isEditMode =false;
}

document.addEventListener("DOMContentLoaded", displayItems);

ClearUi();
