// import Picker from 'vanilla-picker';



const addTodo = document.querySelector(".add-todo");
const addList = document.querySelector(".add-list");

let active = false;
let currentX;
let currentY;
let initialX;
let parentX;
let initialY;
let xOffset = 0;
let yOffset = 0;

let dragItem = document.querySelector(".card");
let okvir = document.querySelector(".todo-items");
let okvirW = document.querySelector(".todo-items").offsetWidth;
let dragItemW = document.querySelector(".card").offsetWidth;
let frame = Math.round((okvirW - dragItemW) / 2);

addList.addEventListener("click", addNewList);
addTodo.addEventListener("click", addNew);

document.querySelector(".todo-container").addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    addNew();
  }
});

function addNew() {
  const inputElement = document.querySelector(".new-item-add");
  const text = inputElement.value.trim();

  if (text !== undefined && text.length > 0) {
    const ul = document.querySelector(".todo-items-container");

    const li = document.createElement("li");
    const taskGroupHeader = document.createElement("div"); // add logic to write only once
    const checkBox = document.createElement("input");
    const collapseExpand = document.createElement("button");
    const checkmark = document.createElement("span");
    const label = document.createElement("label");
    const closeButton = document.createElement("button");
    const closeSpan = document.createElement("span");
    const moveUpButton = document.createElement("button");
    const moveDownButton = document.createElement("button");
    const colorPicker = document.createElement("button");
    // const taskGroupSettings = document.createElement("div");
    const taskGroupSettingsMenu = document.createElement("div");

    /*
    * 
    * drop down menu links
    */
    const exportTodoList = document.createElement('span');
    const pinTodoList = document.createElement('a');

    label.innerText = text;
    const labelText = label;
    labelText.classList.add("container");
    checkmark.classList.add("checkmark", "align-middle");
    closeSpan.classList.add("remove-item");
    collapseExpand.classList.add("collapse-expand", "btn-outline-dark", "btn");
    taskGroupHeader.classList.add("card-header");
    // taskGroupSettings.classList.add("task-settings");
    taskGroupSettingsMenu.classList.add("btn-group", "dropright", "task-settings");
    li.classList.add("todo-items-item", "list-group-item");

    taskGroupHeader.innerHTML = `<input type="text" placeholder="Task Group Name"></input>`;
    // taskGroupSettings.innerHTML = `<i class="fa fa-list-ul"></i>`;
    taskGroupSettingsMenu.innerHTML = `
    <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    <i class="fa fa-list-ul"></i>
    </button>
    <div class="dropdown-menu">
    <!-- Dropdown menu links -->
    </div>`;

    exportTodoList.innerHTML = `<a href="">Download Task List</a>`;
    checkmark.innerHTML = `<i class="fa fa-check"></i>`;
    closeButton.classList.add("close-button", "btn-outline-dark");
    // closeButton.classList.add("hidden");
    moveUpButton.classList.add("moveUp-button", "btn-outline-dark");
    moveDownButton.classList.add("moveDown-button", "btn-outline-dark");
    colorPicker.classList.add("color-picker", "btn-outline-dark", "picker");
    checkBox.classList.add("check-box-input");


    closeButton.innerHTML = `<i class="fa fa-times"></i>`;
    moveUpButton.innerHTML = `<i class="fa fa-arrow-circle-up"></i>`;
    moveDownButton.innerHTML = `<i class="fa fa-arrow-circle-down"></i>`;
    colorPicker.innerHTML = `<i class="fa fa-eyedropper picker" acp-color="#EFE9E7"; 
    acp-show-rgb="no"
    acp-show-hsl="yes"
    acp-show-hex="yes"
    acp-show-alpha></i>`;

    checkBox.setAttribute("type", "checkbox");
    closeButton.addEventListener("click", removeItem);
    moveUpButton.addEventListener("click", moveItemUp);
    moveDownButton.addEventListener("click", moveItemDown);
    exportTodoList.addEventListener("click", exportList);
    colorPicker.addEventListener("click", showColorPicker);
    collapseExpand.addEventListener("click", toggleCollapseTwo);
    // taskGroupHeader.addEventListener("click", toggleCollapseTwo);


    // colorPicker.addEventListener('click', showColorPicker); // {passive: true, capture: true}



    checkBox.addEventListener('click', itemDone);

    labelText.prepend(checkmark, checkBox);
    // checkBox.appendChild(closeSpan);
    li.append(labelText, closeButton);
    li.prepend(labelText, moveUpButton);
    li.prepend(labelText, moveDownButton);
    // li.addEventListener('mouseenter', showCloseButton);
    // li.addEventListener('mouseleave', hideCloseButton);
    ul.appendChild(li);

    if (!document.querySelector('.card-header')) {
      ul.parentNode.prepend(taskGroupHeader);
      // taskGroupHeader.appendChild(taskGroupSettings);
      taskGroupHeader.appendChild(colorPicker);
      taskGroupHeader.appendChild(collapseExpand);
      taskGroupHeader.appendChild(taskGroupSettingsMenu);
      taskGroupHeader.querySelector('.dropdown-menu').appendChild(exportTodoList);
    }
  }
  inputElement.value = "";
}

/* Draggable actions */
okvir.addEventListener("mousedown", function (event) {

  initialX = event.clientX - xOffset;
  initialY = event.clientY - yOffset;
  dragItem.style.boxShadow = "none"


  if (event.target) {
    active = true;

  }
}, false);

okvir.addEventListener("mouseup", function (event) {
  initialX = currentX;
  initialY = currentY;


  active = false;
  dragItem.style.boxShadow = "none"

}, false);


okvir.addEventListener("mousemove", function (event) {

  if (active) {
    event.preventDefault();
    dragItem.style.boxShadow = "6px 5px 16px -4px rgba(0,0,0,0.35)";


    currentX = event.clientX - initialX;
    currentY = event.clientY - initialY;
    /*  
    *   do not let ellemnt go outside parent div, both X and Y
    */
    currentY <= 0 ? currentY = 0 : currentY;
    currentX >= frame ? currentX = frame : currentX;
    currentX <= (-1 * frame) ? currentX = (-1 * frame) : currentX;

    xOffset = currentX;
    yOffset = currentY;
    setTranslate(currentX, currentY, dragItem);

  }
}, false);

function setTranslate(xPos, yPos, el) {
  el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
}

//// !!

function itemDone(event) {
  const item = event.target;
  item.parentNode.parentNode.classList.toggle('done');
  item.parentNode.classList.toggle('done-text');
}

function removeItem(event) {
  let removeButton = event.target;
  if (removeButton.classList[0] === 'fa') {
    removeButton = removeButton.parentNode;
  }
  /*
  *   check if there are no more items in 
  *   to-do list then remove card header as well
  */
  if (removeButton.parentNode.parentNode.childElementCount <= 1) {
    removeButton.parentNode.parentNode.previousElementSibling.remove();
  };

  removeButton.parentNode.remove();
}

function moveItemUp(event) {
  const moveUpButton = event.currentTarget;
  let tempHold = moveUpButton.parentNode;
  let prevNode = moveUpButton.parentNode.previousSibling;
  if (!moveUpButton.parentNode.previousElementSibling) {
    return;
  } else {
    tempHold.parentNode.insertBefore(tempHold, prevNode);
  }

}

function moveItemDown(event) {
  const moveDownButton = event.currentTarget;
  let tempHold = moveDownButton.parentNode;
  let nextNode = moveDownButton.parentNode.nextSibling;
  if (!moveDownButton.parentNode.nextSibling) {
    return;
  } else {
    tempHold.parentNode.insertBefore(tempHold, nextNode.nextSibling);
  }
}

function exportList(event) {
  const target = event.currentTarget;
  const content = target.parentNode.parentNode.parentNode.nextElementSibling;
  let name = target.parentNode.parentNode.parentNode.parentNode.classList;
  let classArry = Object.values(name);
  let number = classArry.find(element => element > "card-")
  let fullName = "myNoteNumber-" + number + ".json"

  let data = { myNote: content.innerText };
  let downloadLink = new Blob([JSON.stringify(data)], { type: 'text/plain' });
  let url = window.URL.createObjectURL(downloadLink);

  // who can we make sure that span is niot the $target?
  target.children[0].setAttribute("download", fullName);
  target.children[0].href = url;
}


function addNewList() {
  let getAllLists = document.querySelectorAll(".card");
  let arry = Array.prototype.slice.call(getAllLists);
  let classNumber = "card-" + (arry.length + 1);
  let lastList = arry.slice(-1)[0];
  let newList = document.createElement("div");
  newList.classList.add("card", "mr-5", classNumber);
  newList.innerHTML = lastList.innerHTML;
  lastList.parentNode.append(newList);
  // lastList.parentNode.append("<div>BLA</div>");
}

function toggleCollapseTwo(event) {
  const target = event.currentTarget;
  // target.nextElementSibling.classList.toggle("hidden");
  target.parentNode.nextElementSibling.classList.toggle("hidden");

  target.classList.toggle("cl");
}

function showColorPicker(event) {
  const target = event.currentTarget;
  let element = target.parentNode.nextElementSibling;

  const picker = new Picker(target);

  window.setInterval(function () {
    picker.onDone = function (color) {
      target.parentNode.style.background = color.rgbaString;
      target.parentNode.nextElementSibling.style.backgroundColor = color.rgbaString;
      // element.style.backgroundColor = color.rgbaString;
    }
  }, 100);


  picker.openHandler();

  //   const picker = new Picker(target);
  //   // picker.onChange = (function(color) {

  //   //   // picker.onChange = function(color) {
  //   //     target.parentNode.style.background = color.rgbaString;
  //   //     target.parentNode.nextElementSibling.style.background = color.rgbaString;
  //   //   // }
  //   // }, {passive: true});
  //   // AColorPicker.from('target')
  //   //   .on('change', (picker, color) => {
  //   //     element.style.backgroundColor = color;
  //   //   });
  //   picker.onDone = function(color) {
  //     // target.parentNode.style.background = color.rgbaString;
  //     // target.parentNode.nextElementSibling.style.backgroundColor = color.rgbaString;
  //     target.style.backgroundColor = color.rgbaString;

  //   }

  //   //Open the popup manually:
  // picker.openHandler();
}


  // picker.onChange = (function(color) {

  //   // picker.onChange = function(color) {
  //     target.parentNode.style.background = color.rgbaString;
  //     target.parentNode.nextElementSibling.style.background = color.rgbaString;
  //   // }
  // }, {passive: true});
  // AColorPicker.from('target')
  //   .on('change', (picker, color) => {
  //     element.style.backgroundColor = color;
  //   });

  //Open the popup manually:
// function showCloseButton(event) {
//   const target = event.target;
//   target.querySelector('.close--button').classList.toggle('hidden');
// }

// function hideCloseButton(event) {
//   const target = event.target;
//   target.querySelector('.close--button').classList.toggle('hidden');
// }


// to do
