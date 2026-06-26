let newTaskBtn=document.querySelector(".new-task-btn");
let formDiv=document.querySelector(".form");
let body=document.querySelector("body");
let crossBtn=document.querySelector(".cut");
let create=document.querySelector("#create");
let form=document.querySelector("form");
let leftDiv=document.querySelector(".left-div");
let taskBtn=document.querySelector("#task-btn");
let rightDiv=document.querySelector(".right-div");
let pendingVal=document.querySelector("#pendingVal");
let completeVal=document.querySelector("#completeVal");
let totalVal=document.querySelector("#totalVal");
let clearTaskBTn=document.querySelector("#clear-task");
let clearFilter=document.querySelector(".clear-filter");
 

let arr = JSON.parse(localStorage.getItem("pendingTasks")) || [];
let complete = JSON.parse(localStorage.getItem("completedTasks")) || [];

let updateIndex=null;
let updateType=null;
let ui=()=>{
    
   leftDiv.innerHTML="";
   leftDiv.innerHTML+= `<div class="left-div-top">
             <h1>Pending</h1>
             <h3>${String(arr.length).padStart(2, "0")}</h3>
            </div>`;
     arr.forEach((elem,index)=>{
        leftDiv.innerHTML+=` <div class="left-div-card">
                 <h2>${elem.title}</h2>
                 <h4>${elem.description}</h4>
                 <h4>${elem.category}</h4>
                 <br>
                 <hr>
                 <br>
                 <div class="left-div-btns">
                    <button id="edit" onclick="updateData('${elem.title}')">Edit</button>
                    <button id="complete" onclick="completeFxn('${index}')">Complete</button>
                    <button id="delete" onclick="deleteData('${index}')">Delete</button>
                 </div>
             </div>`
     })
     pendingVal.textContent = `Pending: ${String(arr.length).padStart(2,"0")}`;
     completeVal.textContent = `Complete: ${String(complete.length).padStart(2,"0")}`;
      totalVal.textContent = `Total: ${String(arr.length+complete.length).padStart(2,"0")}`;
     rightDiv.innerHTML="";
      rightDiv.innerHTML+= `<div class="right-div-top">
             <h1>Completed</h1>
             <h3>${String(complete.length).padStart(2, "0")}</h3>
            </div>`;
    complete.forEach((elem,index)=>{
        rightDiv.innerHTML+=` <div class="right-div-card">
                 <h2>${elem.title}</h2>
                 <h4>${elem.description}</h4>
                 <h4>${elem.category}</h4>
                 <br>
                 <hr>
                 <br>
                 <div class="right-div-btns">
                    <button id="edit" onclick="updateComplete('${elem.title}')">Edit</button>
                    <button id="completed">Completed</button>
                    <button id="delete" onclick="deleteComplete('${index}')">Delete</button>
                </div>
             </div>`
     })
}

 

newTaskBtn.addEventListener('click',()=>{
   formDiv.style.display="flex";
    // body.style.overflow="hidden";
})

crossBtn.addEventListener("click",()=>{
     formDiv.style.display="none";
})
taskBtn.addEventListener("click",()=>{
    formDiv.style.display="none";   
})

form.addEventListener("submit",(e)=>{
    e.preventDefault();
    let title=e.target[0].value;
    let description=e.target[1].value;
    let category=e.target[2].value;

    if(title.trim()==='' || description.trim()==='' || category===''){
     alert("These fields are required");
     return;
}
let obj={
    title:title,
    description:description,
    category:category,
}
if(updateIndex!=null){
   if(updateType==="pending"){
      arr[updateIndex]=obj;
   }
   else{
      complete[updateIndex]=obj;
   }
updateIndex=null;
 updateType = null;
}
else{
arr.push(obj);
}
saveData();
ui();
form.reset();

});


ui();




clearTaskBTn.addEventListener("click",()=>{
   arr=[];
   complete=[];
   saveData();
   ui();
   
})

function saveData(){
    localStorage.setItem("pendingTasks", JSON.stringify(arr));
    localStorage.setItem("completedTasks", JSON.stringify(complete));
}

 function updateData(name){
   updateType="pending"
    formDiv.style.display="flex";
    let data=arr.find((elem)=>{
       return elem.title===name;
    })
    updateIndex=arr.findIndex((elem)=>{
     return  elem.title===name;
    })
    form[0].value=data.title;
    form[1].value=data.description;
    form[2].value=data.category;
 }

 function deleteData(index){
    arr.splice(index,1);
    saveData();
    ui();
 }

 function completeFxn(index){
    complete.push(arr[index]);
     arr.splice(index,1);
     saveData();
     ui();
 }
  function updateComplete(name){
   updateType="complete"
    formDiv.style.display="flex";
    let data=complete.find((elem)=>{
       return elem.title===name;
    })
    updateIndex=complete.findIndex((elem)=>{
     return  elem.title===name;
    })
    form[0].value=data.title;
    form[1].value=data.description;
    form[2].value=data.category;
 }
 function deleteComplete(index){
   complete.splice(index,1);
   ui();
 }

 
create.addEventListener("click", () => {
    body.classList.toggle("light-mode");

    if(body.classList.contains("light-mode")){
        create.textContent = "🌙";
    }else{
        create.textContent = "☀️";
    }
});

function applyFilters() {

    let searchValue = searchTask.value.toLowerCase().trim();
    let selectedCategory = categories.value.toLowerCase();

    let filteredTasks = arr.filter(task => {

        let matchSearch =
            task.title.toLowerCase().includes(searchValue) ||
            task.category.toLowerCase().includes(searchValue);

        let matchCategory =
            selectedCategory === "" ||
            selectedCategory === "all categories" ||
            task.category.toLowerCase() === selectedCategory;

        return matchSearch && matchCategory;
    });

    leftDiv.innerHTML = `
    <div class="left-div-top">
        <h1>Pending</h1>
        <h3>${String(filteredTasks.length).padStart(2, "0")}</h3>
    </div>`;

    filteredTasks.forEach((elem) => {

        let originalIndex = arr.indexOf(elem);

        leftDiv.innerHTML += `
        <div class="left-div-card">
            <h2>${elem.title}</h2>
            <h4>${elem.description}</h4>
            <h4>${elem.category}</h4>

            <br>
            <hr>
            <br>

            <div class="left-div-btns">
                <button onclick="updateData('${elem.title}')">Edit</button>
                <button onclick="completeFxn(${originalIndex})">Complete</button>
                <button onclick="deleteData(${originalIndex})">Delete</button>
            </div>
        </div>`;
    });
}

searchTask.addEventListener("input", applyFilters);
categories.addEventListener("change", applyFilters);
clearFilter.addEventListener("click", () => {

    searchTask.value = "";
    categories.selectedIndex = 0;

    ui();
});