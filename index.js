const taskContainer = document.querySelector(".task__container");

let globalStore = []; //some values [{...}, {...} , {...}]

const generateNewCard = (taskData) => `
 <div class="col-md-6 col-lg-4" id=${taskData.id}>
 <div class="card text-center">
   <div class="card-header d-flex justify-content-end gap-2">
     <button type="button"  id=${taskData.id} class="btn btn-outline-success"  onclick="editCard.apply(this, arguments)">
     <i class="fas fa-pencil-alt" id=${taskData.id} onclick="editCard.apply(this, arguments)"></i>
     </button>
<button type="button" class="btn btn-outline-danger" id=${taskData.id} onclick="deleteCard.apply(this, arguments)">
<i class="fas fa-trash" id=${taskData.id} onclick="deleteCard.apply(this, arguments)"></i>
</button>
   </div>
   <img src=${taskData.imageUrl} class = "card-img-top" alt="..."/>
   <div class="card-body">
     <h5 class="card-title">${taskData.taskTitle}</h5>
     <p class="card-text">${taskData.taskDescription}</p>
     <a href="#" class="btn btn-primary">${taskData.taskType}</a>
   </div>
   <div class="card-footer text-muted">
     <button type="button" id=${taskData.id} class="btn btn-outline-primary float-end">Open Task</button>
   </div>
  </div>  
</div>
 
 `;

 const loadInitialCardData = () => {
   //local storage to get initial card data
   const getCardData = localStorage.getItem("tasky"); //here we are getting the data 
                                                      //from local storage and storing it into a
                                                      //constant called "getCardData"

   //convert from string to a normal object
   const  {cards} = JSON.parse(getCardData); //here we are converting it ( on line 63) to 
                                             //string and we are parsing back  to objects 
                                              
   //loop over those array of task object to create HTML card , 
   cards.map((cardObject)  => {
    //inject it to DOM 
    taskContainer.insertAdjacentHTML("beforeend",generateNewCard(cardObject));
   //update our global store 
    globalStore.push(cardObject);
   
   })                                      
 };


const saveChanges = () => {
    const taskData = {
        id: `${Date.now()}` ,
        imageUrl: document.getElementById("Imageurl").value ,
        taskTitle: document.getElementById("Tasktitle").value ,
        taskType: document.getElementById("Tasktype").value ,
        taskDescription: document.getElementById("Taskdescription").value
    };

 

taskContainer.insertAdjacentHTML("beforeend",generateNewCard(taskData));

globalStore.push(taskData);
localStorage.setItem("tasky",JSON.stringify({cards:globalStore})); //here we have used 
//cards object because JSON.stringify expects an object and globalStore is an array. so we created 
//object named as cards and inside that we added this globalStore

};

const deleteCard = (event) => {
  event = window.event;
  //first we need the id of the element to be deleted 
  const targetId = event.target.id;
  //now we have to detect that whtehr the user have clicked on the icon or the button of delete
  const tagname = event.target.tagName; 
  //match the id of the element with the id inside the globalStore
  //If match found remove it
  globalStore = globalStore.filter((cardObject) => cardObject.id !== targetId);
  localStorage.setItem("tasky",JSON.stringify({cards:globalStore})); //an object
  //contact parent 

  if(tagname === "BUTTON") {
    return   taskContainer.removeChild(event.target.parentNode.parentNode.parentNode);

  }
  else {
    return    taskContainer.removeChild(event.target.parentNode.parentNode.parentNode.parentNode);
  }

};


//close the model after save
//page refresh will caus the data to be deleted --> it will be solved 
//using "local storage" concept..but we will be only getting 5mb storage to store our data
//local storage is implemented using API - Application Programming Interface

//here local sotrage - Application
// access application via --> Programming
// interface is a mediator , basically interface provides with something
//which we can use to intercat with the application programatically

//so here we will access local storage --> with some methods(like add,delete,update etc.) --> using javascript

const editCard =  (event) => {
  event = window.event;
  const targetId = event.target.id;
  const tagname = event.target.tagName;

  let parentElement;

  if (tagname === "BUTTON") {
    parentElement=event.target.parentNode.parentNode; 
  }
  else {
    parentElement=event.target.parentNode.parentNode.parentNode;
  }

   
  let taskTitle = parentElement.childNodes[5].childNodes[1];
  let taskDescription = parentElement.childNodes[5].childNodes[3];
  let taskType = parentElement.childNodes[5].childNodes[5];
  let submitButton = parentElement.childNodes[7].childNodes[1];
  taskTitle.setAttribute("contenteditable" , "true");
  taskDescription.setAttribute("contenteditable" , "true");
  taskType.setAttribute("contenteditable" , "true");
  submitButton.setAttribute("onclick",
   "saveEditChanges.apply(this,arguments)");
  submitButton.innerHTML = "Save Changes"; //it will change open task button to save changes during edtitng time

 };
 
 const saveEditChanges = (event) => {
  event = window.event;
  const targetId = event.target.id;
  const tagname = event.target.tagName;

  let parentElement;

  if (tagname === "BUTTON") {
    parentElement=event.target.parentNode.parentNode; 
  }
  else {
    parentElement=event.target.parentNode.parentNode.parentNode;
  }

   
  let taskTitle = parentElement.childNodes[5].childNodes[1];
  let taskDescription = parentElement.childNodes[5].childNodes[3];
  let taskType = parentElement.childNodes[5].childNodes[5];
  let submitButton = parentElement.childNodes[7].childNodes[1];
 
  const updatedData = {
    taskTitle: taskTitle.innerHTML,
    taskDescription: taskDescription.innerHTML,
    taskType: taskType.innerHTML,

  };

  globalStore = globalStore.map((task) => {
     if (task.id === targetId) {
       return {
         id: task.id,
         imageUrl: task.imageUrl,
        taskTitle: updatedData.taskTitle ,
        taskType: updatedData.taskType,
        taskDescription: updatedData.taskDescription, 

       };
      }
       return task; // important
  });
  localStorage.setItem("tasky",JSON.stringify({cards:globalStore}));
  taskTitle.setAttribute("contenteditable" , "flase");
  taskDescription.setAttribute("contenteditable" , "false");
  taskType.setAttribute("contenteditable" , "false");
  submitButton.removeAttribute("onclick");
  submitButton.innerHTML = "Open Task";
 };


