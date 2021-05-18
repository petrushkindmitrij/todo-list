const divListItems = document.getElementById('div-list-items'); 

const inputNewItem = document.getElementById("input-new-item");
const btnNewItem = document.getElementById("btn-new-item");

const divFilter = document.getElementById("div-filter");

let dataItems = [];

let filterMode = 'all';

window.onload = ()=>{
  dataItems = JSON.parse(localStorage.getItem('dataItems'));
  if (dataItems === null) 
    dataItems = [];

  dispItems();
};

// Добавить новую позицию
btnNewItem.addEventListener('click', addNewItem);

window.addEventListener('keydown', e => {
  switch (e.key) {  
    case 'Enter':      
      addNewItem();      
      break;
    }
})

divListItems.addEventListener('click', checkItem);

divListItems.addEventListener('click', deleteItem);

divFilter.addEventListener('click', (e) => {
  switch(e.target.id){
    case "input-filter-all":
      filterMode = 'all';
      dispItems();
      break;
    case "input-filter-uncompleted":
      filterMode = 'uncompleted';
      dispItems();
      break;
    case "input-filter-completed":
      filterMode = 'completed';
      dispItems();
      break;

  }
});


function addNewItem() {

  if (inputNewItem.value !== ''){
    
    filterMode = 'all';
    document.getElementById('input-filter-all').checked = true;
    document.getElementById('input-filter-uncompleted').checked = false;
    document.getElementById('input-filter-completed').checked = false;

    const dataItem = {
      text: inputNewItem.value, 
      completed: false
    };
    
    // анимация
    dispItem(dataItem, true);

    // событие происходит после окончания анимации
    setTimeout(function() {

      dataItems.push(dataItem);

      dispItems();
      
      saveList();

      inputNewItem.value = '';
    }, 200);
  }
}

// Отметить позицию как выполненную
function checkItem(e) {
  if (e.target.classList.contains('item__btn-completed') || e.target.classList.contains('item__text')){
    
    dataItems[getNumberItem(e.target, ['.item__btn-completed', '.item__text'])].completed
     = !dataItems[getNumberItem(e.target, ['.item__btn-completed', '.item__text'])].completed;

    dispItems();

    saveList();    
  }  
}

// Удалить позицию
function deleteItem(e) {

  if (e.target.classList.contains('item__btn-delete')){        

    e.target.parentElement.classList.add('container--animated-delete');  

    e.target.parentElement.addEventListener('animationend', function() {
      dataItems.splice(getNumberItem(e.target, ['.item__btn-delete']), 1);
      dispItems();
      saveList();
    }); 

  }  
}

function getNumberItem(eTarget, classNames){
  const arrItems = document.getElementsByClassName('item__container');
  for(let iItems = 0; iItems < arrItems.length; iItems++){
    if (classNames.some((className) => {
      return arrItems[iItems].querySelector(className) === eTarget
    })){
      return iItems;
    }
  }
}

function dispItems(){
  divListItems.innerHTML = '';
  dataItems.forEach((dataItem) => {    
    dispItem(dataItem);        
  })
}
function dispItem(dataItem, flagAnimatedAdd = false){
    const divContainer = document.createElement('div');
    divContainer.classList.add('item__container');

    if (flagAnimatedAdd){
      divContainer.classList.add('container--animated-add');

      divContainer.style.zIndex = 0; // нужно для анимации
    } else{
      divContainer.style.zIndex = 1; // нужно для анимации
    }

    if (dataItem.completed){
      divContainer.classList.add('container--checked')
    }
    
    if (filterMode === 'completed' && !dataItem.completed){
      divContainer.style.display = 'none';
    }
    if (filterMode === 'uncompleted' && dataItem.completed){
      divContainer.style.display = 'none';
    }
    
    const btnCompleted = document.createElement('input');
    btnCompleted.classList.add('item__btn-completed');
    btnCompleted.setAttribute('type', 'checkbox');
    divContainer.append(btnCompleted);
  
    const pCompleted = document.createElement('p');
    pCompleted.classList.add('item__text');
    pCompleted.innerText = dataItem.text;
    divContainer.append(pCompleted);
  
    const btnDelete = document.createElement('button');
    btnDelete.classList.add('item__btn-delete');
    btnDelete.innerHTML = '<svg enable-background="new 0 0 386.667 386.667" height="512" viewBox="0 0 386.667 386.667" width="512" xmlns="http://www.w3.org/2000/svg"><path d="m386.667 45.564-45.564-45.564-147.77 147.769-147.769-147.769-45.564 45.564 147.769 147.769-147.769 147.77 45.564 45.564 147.769-147.769 147.769 147.769 45.564-45.564-147.768-147.77z"/></svg>';
    divContainer.append(btnDelete);
    
    divListItems.append(divContainer);
}

// сохранение данных в локальное хранилище
function saveList(){
  localStorage.setItem('dataItems', JSON.stringify(dataItems));
}



// document.getElementById('div-filter').addEventListener('click', (e) => {
//   console.log(e);
// });