// your code here, it may be worth it to ensure this file only runs AFTER the dom has loaded.
document.addEventListener("DOMContentLoaded", () => {
    let UPPER_RANGE = document.getElementById('higher-bmr-range').textContent;
    let PR = document.getElementsByClassName('uk-progress')[0];
    PR.max = UPPER_RANGE;

    function createCalorieListItem(entry){
        let caloriesList = document.getElementById('calories-list');
        let caloriesListItem = document.createElement('li');
        caloriesListItem.classList.add('calories-list-item');
        caloriesListItem.setAttribute('data-id', entry.id);
        let div1 = document.createElement('div');
        div1.classList.add('uk-grid');
        let div2 = document.createElement('div');
        div2.classList.add('uk-width-1-6');
        let strong = document.createElement('strong');
        let strongText = document.createTextNode(entry.calorie);
        let strongSpan = document.createElement('span');
        let strongSpanText = document.createTextNode('kcal');
        strongSpan.appendChild(strongSpanText);
        strong.appendChild(strongText);
        div2.appendChild(strong);
        div2.appendChild(strongSpan);
        let div3 = document.createElement('div');
        let em = document.createElement('em')
        let emText = document.createTextNode(entry.note);
        em.appendChild(emText);
        em.classList.add('uk-text-meta');
        div3.classList.add('uk-width-4-5');
        div3.appendChild(em);
        div1.appendChild(div2);
        div1.appendChild(div3);
        
        let div4 = document.createElement('div');
        div4.classList.add('list-item-menu');

        let a1 = document.createElement('a');
        a1.classList.add('edit-button');
        a1.setAttribute('data-id', entry.id);
        a1.setAttribute('uk-icon', "icon: pencil");
        a1.setAttribute('uk-toggle', "target: #edit-form-container");

        let a2 = document.createElement('a');
        a2.classList.add('delete-button');
        a2.setAttribute('data-id', entry.id);
        a2.setAttribute('uk-icon', "icon: trash");

        div4.appendChild(a1);
        div4.appendChild(a2);

        caloriesListItem.appendChild(div1);
        caloriesListItem.appendChild(div4)
        caloriesList.appendChild(caloriesListItem);
    }

    function createCaloriesList(){
        fetch('http://localhost:3000/api/v1/calorie_entries')
        .then(response => response.json())
        .then(json => {
            let reducer = (acc, currValue) => acc + currValue;
            //json.forEach(entry => createCalorieListItem(entry));
            let newJson = json;
            newJson.sort(function(a,b){
                return new Date(b.created_at) - new Date(a.created_at)
            })
            newJson.forEach(entry => createCalorieListItem(entry));
            let calorieArray = json.map(elem => elem.calorie);
            let sum = calorieArray.reduce(reducer);
            let progress = document.getElementsByClassName('uk-progress')[0];
            progress.value = sum;
        })
    }

    function destroyCaloriesList(){
        let caloriesList = document.getElementById('calories-list');
        while(caloriesList.firstChild){
            caloriesList.removeChild(caloriesList.firstChild);
        }
    }
    destroyCaloriesList();
    createCaloriesList();

    function getFormData(){
        let calorieForm = document.getElementById('new-calorie-form');
        let calorie = calorieForm.querySelector('.uk-input')
        let note = calorieForm.querySelector(".uk-textarea") 
        return {
            api_v1_calorie_entry: {calorie: parseFloat(calorie.value), note: note.value}
        }
    }

    function addToCaloriesList(entry){
        let caloriesList = document.getElementById('calories-list');
        let caloriesListItem = document.createElement('li');
        caloriesListItem.classList.add('calories-list-item');
        caloriesListItem.setAttribute('data-id', entry.id);
        let div1 = document.createElement('div');
        div1.classList.add('uk-grid');
        let div2 = document.createElement('div');
        div2.classList.add('uk-width-1-6');
        let strong = document.createElement('strong');
        let strongText = document.createTextNode(entry.calorie);
        let strongSpan = document.createElement('span');
        let strongSpanText = document.createTextNode('kcal');
        strongSpan.appendChild(strongSpanText);
        strong.appendChild(strongText);
        div2.appendChild(strong);
        div2.appendChild(strongSpan);
        let div3 = document.createElement('div');
        let em = document.createElement('em')
        let emText = document.createTextNode(entry.note);
        em.appendChild(emText);
        em.classList.add('uk-text-meta');
        div3.classList.add('uk-width-4-5');
        div3.appendChild(em);
        div1.appendChild(div2);
        div1.appendChild(div3);
        
        let div4 = document.createElement('div');
        div4.classList.add('list-item-menu');

        let a1 = document.createElement('a');
        a1.classList.add('edit-button');
        a1.setAttribute('data-id', entry.id);
        a1.setAttribute('uk-icon', "icon: pencil");
        a1.setAttribute('uk-toggle', "target: #edit-form-container");

        let a2 = document.createElement('a');
        a2.classList.add('delete-button');
        a2.setAttribute('data-id', entry.id);
        a2.setAttribute('uk-icon', "icon: trash");

        div4.appendChild(a1);
        div4.appendChild(a2);

        caloriesListItem.appendChild(div1);
        caloriesListItem.appendChild(div4)
        caloriesList.prepend(caloriesListItem);
    }

    function createCalorieEntry(){
        //console.log(getFormData());
        let configObj = {
            method: "POST",
            headers: {
                "Content-Type": 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(getFormData())
        }
        //console.log(configObj);
        fetch('http://localhost:3000/api/v1/calorie_entries',configObj)
        .then(response => response.json())
        .then(json => {
            addToCaloriesList(json);
            let progress = document.getElementsByClassName('uk-progress')[0];
            //console.log(progress.value);
            progress.value = parseInt(progress.value,10) + parseInt(json.calorie,10);
        })
        .catch(error => {
            console.log(error);
            alert("ERROR POSTING TO DATABASE");
        })
    }

    function makeTimeString(){
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        let milliseconds = date.getMilliseconds();
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
    }

    function getCaloriesListEntry(id){
        let caloriesList = document.getElementById('calories-list');
        let calorieListItems = caloriesList.querySelectorAll('li');
        let item;
        calorieListItems.forEach(elem => {
            if(elem.getAttribute('data-id') == id){
                item = elem;
            }
        });
        return item;
        //console.log(calorieListItems);
    }

    function editCalorieEntry(id){
        let formData = {api_v1_calorie_entry: getEditFormValues()}
        let configObj = {
            method: "PATCH",
            headers: {
                "Content-Type": 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(formData)
        }
        fetch(`http://localhost:3000/api/v1/calorie_entries/${id}`, configObj)
        .then(response => response.json())
        .then(json => {
            //console.log(json);
            let entry = getCaloriesListEntry(json.id);
            let strong = entry.getElementsByTagName('strong')[0];
            strong.textContent = json.calorie;
            let em = entry.getElementsByTagName('em')[0];
            em.textContent = json.note;
        })
        .catch(error => {
            console.log(error);
            alert("FAILED TO UPDATE ENTRY");
        })
    }

    function getEditFormValues(){
        let editForm = document.getElementById('edit-calorie-form');
        let calorieInput = editForm.querySelector('.uk-input');
        let noteInput = editForm.querySelector('.uk-textarea');
        return {calorie: parseInt(calorieInput.value, 10), note: noteInput.value};
    }

    function deleteCalorieEntry(id){
        let configObj = {
            method: "DELETE",
            headers: {
                "Content-Type": 'application/json',
                Accept: 'application/json'
            }
        }
        fetch(`http://localhost:3000/api/v1/calorie_entries/${id}`, configObj)
        .then(()=>{
            destroyCaloriesList();
            createCaloriesList();
        })
    }

    function getBMRFormValues(){
        let bmrForm = document.getElementById('bmr-calculator');
        let weight = bmrForm.querySelectorAll('.uk-input')[0];
        let height = bmrForm.querySelectorAll('.uk-input')[1];
        let age = bmrForm.querySelectorAll('.uk-input')[2];
        return {weight: parseInt(weight.value,10), height: parseInt(height.value,10), age: parseInt(age.value, 10)};
    }

    function calculateBMR(){
        let values = getBMRFormValues();
        //console.log(values);
        let lower = 655 + (4.35 * values.weight) + (4.7 * values.height) - (4.7 * values.age);
        let upper = 66 + (6.23 * values.weight) + (12.7 * values.height) - (6.8 * values.age);
        return {lower: lower, upper: upper};
    }

    document.getElementById('new-calorie-form').addEventListener("submit", (event) => {
        event.preventDefault()
        createCalorieEntry();
    });

    document.getElementById('calories-list').addEventListener('click', (event) => {
        let target = event.target;
        if(target.getAttribute('data-svg')==="trash"){
            target = target.parentNode;
            let id = target.getAttribute('data-id');
            deleteCalorieEntry(id);
        }
        else if(target.getAttribute('data-svg')==="pencil"){
            let editButton = target.parentNode;
            let id = editButton.getAttribute('data-id');
            let caloriesListItem = editButton.parentNode.parentNode;
            let currentCalories = caloriesListItem.getElementsByTagName('strong')[0].textContent;
            let currentNote = caloriesListItem.getElementsByTagName('em')[0].textContent;
            //console.log(currentCalories);
            let editForm = document.getElementById('edit-calorie-form');
            editForm.setAttribute('data-id', id);
            let calorieInput = editForm.querySelector('.uk-input');
            let noteInput = editForm.querySelector('.uk-textarea');
            //console.log(noteInput);
            calorieInput.value = currentCalories;
            noteInput.value = currentNote;
        }
    })

    document.getElementById('bmr-calculator').addEventListener("submit", (event) => {
        event.preventDefault()
        let range = calculateBMR();
        let lowerSpan = document.getElementById('lower-bmr-range');
        let upperSpan = document.getElementById('higher-bmr-range');
        lowerSpan.textContent = range.lower;
        upperSpan.textContent = range.upper;
        let progress = document.getElementsByClassName('uk-progress')[0];
        progress.max = (range.upper + range.lower)/2
    })

    document.getElementById('edit-calorie-form').addEventListener('submit', (event) => {
        event.preventDefault();
        let id = event.target.getAttribute('data-id');
        editCalorieEntry(id);
    })

})