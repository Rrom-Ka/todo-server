(function(){

    let listArray = [];
    let listName;
    //создаем и возвращаем заголовок приложения
    function createAppTitle(title) {
        let appTitle =document.createElement('h2');
        appTitle.innerHTML=title;
        return appTitle;
    }

    //создаем и возвращаем форму для создания дела
    function createTodoItemForm() {
        let form =document.createElement('form');
        let input =document.createElement('input');
        let buttonWrapper=document.createElement('div');
        let button=document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder ='Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        buttonWrapper.classList.add('btn', 'btn-primary');
        button.textContent ='Добавить дело';
        button.disabled=true;

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);
    //проверка на наличие записи в input и активация(дезактивация) кнопки
        input.addEventListener('input', function(){
            if (input.value !==""){
                button.disabled=false
            } else {
                button.disabled = true;
            }
        })

        return {
            form,
            input,
            button,
        };
    }

        //создаем и возвращаем список элементов
    function crateTodoList() {
        let list =document.createElement('ul');
        list.classList.add('list-groupe');
        return list;
    }

        //ф-я добавления дела (строки с кнопаками)
    function createTodoItem(obj){
        let item = document.createElement('li');
        //кнопки помещяаем в элемент, который красиво покажет их в одной группе
        let buttonGroup =document.createElement('div');
        let doneButton =document.createElement('button');
        let deleteButton =document.createElement('buuton');

        //устаналвилваем стили для элемента списка, а также для размещения кнопок
        //в его правй части с помощью flex
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-item-center');
        item.textContent=obj.name;

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent='Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        if (obj.done==true) item.classList.add('list-group-item-success')

        //добавляем обработчики на кнопки
        doneButton.addEventListener('click', function(){
            item.classList.toggle('list-group-item-success');
            const currentId = obj.id;
            console.log('currentId',obj);
            for(let listItem of listArray){
                if (listItem.id ==currentId) {
                    listItem.done=!listItem.done
                }
            }
            saveList(listArray, listName);
        })

        deleteButton.addEventListener('click', function(){
            if (confirm('Вы уверены')){
                item.remove();

                const currentId =obj.id;
                for (let i=0; i<listArray.length;i++){
                    if(listArray[i].id==currentId) listArray.splice(i, 1)
                }
                saveList(listArray, listName);
            }
        })

        //Вкладываем кнопки в отдельный элемент, чтбы они объединились в один блок
        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        //приложению нужен доступ к самому элементу и кнопкам, чтобыобрабатывать события нажатия
        return{
            item,
            doneButton,
            deleteButton,
        };
    }
        //функция вычисления id
    function getNewId(arr){
        let max=0;
        for (let item of arr){
            if(item.id>max) max=item.id;
        }
        return max+1;
    }

        //ф-я сохранения списка вхранилище
    function saveList(arr, keyName){
        localStorage.setItem(keyName, JSON.stringify(arr));
    }

        //основная функция

    function createTodoApp(container, title='Список дел', keyName, defArray=[]){

        //let container =document.getElementById('todo-app');
        
        let todoAppTitle =createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList= crateTodoList();
        
        listName=keyName;
        listArray=defArray;
        console.log(listArray)
    
            container.append(todoAppTitle);
            container.append(todoItemForm.form);
            container.append(todoList);

            let localData = localStorage.getItem(listName);
                if(localData!==null & localData!=='') {
                    listArray=JSON.parse(localData);
                }
                console.log(listArray)
                for (let itemList of listArray){
                    let todoItem = createTodoItem(itemList);
                    todoList.append(todoItem.item)
                }
            
            //браузер создает событие submit  на форме по нажатию на  Enter или на кнопку создания дела
            todoItemForm.form.addEventListener('submit', function(e){
                //эта строчка необходима , чтобы предотвраитиьт страндартное действие браузера
                //в данном случае мы не хотим, чтобы страница перезагружаласть при отправке формы
                e.preventDefault();
    
                //игнорируем создание элемента если пользователь ни чего не ввел в поле
    
                if (!todoItemForm.input.value){
                    return;
                }
                let newItem ={
                                id:getNewId(listArray),
                                name: todoItemForm.input.value,
                                done: false,
                            }
                //создаем и добавляем в список новое делос название из поля для ввода
                let todoItem =createTodoItem(newItem);

                listArray.push(newItem)

                saveList(listArray, listName);
                //создаем и добавлем в список новео дело с названием из поля для ввода
                todoList.append(todoItem.item);
                //обнуляем значение в поле, чтобы не пришлось стирать его вручную
                todoItemForm.button.disabled=true;
                todoItemForm.input.value ='';
            })
    }
    

    //регистрируем функцию createTodoApp в глоабальном объекте window
    window.createTodoApp=createTodoApp;

    
})();