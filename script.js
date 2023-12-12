const toggle = document.querySelector('#toggle');
let theme = localStorage.getItem('theme');

if(!theme) {
    localStorage.setItem('theme', 'light');
}

const darkMode = () => {
    document.body.classList.add('dark-mode');
    toggle.innerHTML = 'Light Mode';
    localStorage.setItem('theme', 'dark');
}


const lightMode = () => {
    document.body.classList.remove('dark-mode');
    toggle.innerHTML = 'Dark Mode';
    localStorage.setItem('theme', 'light');
}

if(theme === 'dark') {
    darkMode();
}

toggle.addEventListener('click', function(e) {
    theme = localStorage.getItem('theme');
    if(theme === 'light') {
        darkMode();
    } else {
        lightMode();
    }

    e.preventDefault();
});

function scrollToTop() {
    if (document.body.scrollTop !== 0 || document.documentElement.scrollTop !== 0) {
        window.scrollBy(0, -50);
        setTimeout(scrollToTop, 10);
    }    
}

window.onscroll = function() {
    var button = document.getElementById("scrollToTopBtn");
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        button.style.display = "block";
    } else {
        button.style.display = "none";
    }
}

function validateForm() {
    var title = document.getElementById('title').value;
    var author = document.getElementById('author').value;
    var year = document.getElementById('year').value;

    if(title == '') {
        alert('Silahkan isi judul buku');
        return false;
    }

    if(author == '') {
        alert('Silahkan isi nama penulisnya');
        return false;
    }

    if(year == '') {
        alert('Silahkan isi tahun buku');
        return false;
    }

    return true;     
}


function showData() {
    var mybooksList;
    if(localStorage.getItem('mybooksList') == null) {
        mybooksList = [];
    } else {
        mybooksList = JSON.parse(localStorage.getItem('mybooksList'));
    }

    var html = '';

    mybooksList.forEach(function(element, index) {
        html += '<tr>';
        html += '<td>' + element.title + '</td>';
        html += '<td>' + element.author + '</td>';
        html += '<td>' + element.year + '</td>';        
        html += '<td><button onclick="deleteData(' + index +')" class="badge text-bg-danger">Remove</button><button onclick="updateData(' + index +')" class="badge text-bg-warning m-2">Edit</button><button onclick="moveToCompleted(' + index +')" class="badge text-bg-info m-2">Finish</button></td>'
        html += '</tr>';
    });

    document.querySelector('#yetTable tbody').innerHTML = html;
}


function AddData() {    
    if(validateForm() == true){
        var title = document.getElementById('title').value;
        var author = document.getElementById('author').value;
        var year = document.getElementById('year').value;
        
        
        function generateId() {
            return +new Date();
        }        

        var mybooksList;
        if(localStorage.getItem('mybooksList') == null) {
            mybooksList = [];            
        } else {
            mybooksList = JSON.parse(localStorage.getItem('mybooksList'));
        }

        mybooksList.push({
            id : generateId(),
            title : title,
            author: author,
            year: Number(year),
            isComplete: false,            
        });        

        localStorage.setItem('mybooksList', JSON.stringify(mybooksList));
        showData();
        alert("Buku Siap Ditambahkan!");
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('year').value = '';        
    }
}

function deleteData(index){      
    var mybooksList;
    if(localStorage.getItem('mybooksList') == null) {        
        mybooksList = [];        
    } else {
        mybooksList = JSON.parse(localStorage.getItem('mybooksList'));       
        
    }

    var isConfirmed = confirm("Yakin mau membuang data ini?");
    if(isConfirmed) {
        mybooksList.splice(index, 1);           
        localStorage.setItem('mybooksList', JSON.stringify(mybooksList));            
        
        showData();        
    }
}

function updateData(index){
    document.getElementById('submit').style.display = ' none';
    document.getElementById('update').style.display = ' block';

    var mybooksList;
    if(localStorage.getItem('mybooksList') == null) {
        mybooksList = [];
    } else {
        mybooksList = JSON.parse(localStorage.getItem('mybooksList'));
    }

    document.getElementById('title').value = mybooksList[index].title;
    document.getElementById('author').value = mybooksList[index].author;
    document.getElementById('year').value = mybooksList[index].year;    

    document.querySelector('#update').onclick = function() {
        if(validateForm() == true){
            mybooksList[index].title = document.getElementById('title').value;
            mybooksList[index].author = document.getElementById('author').value;
            mybooksList[index].year = document.getElementById('year').value;
            

            localStorage.setItem('mybooksList', JSON.stringify(mybooksList));

            showData();

            document.getElementById('title').value = "";
            document.getElementById('author').value = "";
            document.getElementById('year').value = "";            

            //Update button will hide & submit button will show for updating of Data in localStorage
            document.getElementById('submit').style.display = ' block';
            document.getElementById('update').style.display = ' none';

        }
    
    }

}

function moveToCompleted(index) {
    var mybooksList = JSON.parse(localStorage.getItem('mybooksList'));    
    
    var movedBook = mybooksList[index];
    mybooksList.splice(index, 1);    
    movedBook.isComplete = true;

    var completedBooksList;
    if(localStorage.getItem('completedBooksList') == null) {
        completedBooksList = [];
    } else {
        completedBooksList = JSON.parse(localStorage.getItem('completedBooksList'));
    }

    completedBooksList.push(movedBook);
    localStorage.setItem('completedBooksList', JSON.stringify(completedBooksList));   
    localStorage.setItem('mybooksList', JSON.stringify(mybooksList));

    
    showData();
    showCompletedData();
}


function deleteCompletedData(id) {
    var completedBooksList;
    if (localStorage.getItem('completedBooksList') == null) {
        completedBooksList = [];
    } else {
        completedBooksList = JSON.parse(localStorage.getItem('completedBooksList'));
    }
    
    var index = completedBooksList.findIndex(function (book) {
        return book.id == id;
    });
    
    var isConfirmed = confirm("Yakin akan menghapus data ini?");
    if (isConfirmed) {        
        completedBooksList.splice(index, 1);
        localStorage.setItem('completedBooksList', JSON.stringify(completedBooksList));
        
        showCompletedData();
    }
}


function moveToUncompleted(id) {
    var completedBooksList;
    if(localStorage.getItem('completedBooksList') == null) {
        completedBooksList = [];
    } else {
        completedBooksList = JSON.parse(localStorage.getItem('completedBooksList'));
    }

    var index = completedBooksList.findIndex(function (book) {
        return book.id == id;
    });

    var movedBook = completedBooksList[index];
    completedBooksList.splice(index, 1);

    var mybooksList;
    if(localStorage.getItem('mybooksList') == null) {
        mybooksList = [];
    } else {
        mybooksList = JSON.parse(localStorage.getItem('mybooksList'));
    }

    movedBook.isComplete = false;
    mybooksList.push(movedBook);

    localStorage.setItem('completedBooksList', JSON.stringify(completedBooksList));
    localStorage.setItem('mybooksList', JSON.stringify(mybooksList));

    showData();
    showCompletedData();
}

function showCompletedData() {
    var completedBooksList;
    if(localStorage.getItem('completedBooksList') == null) {
        completedBooksList = [];
    } else {
        completedBooksList = JSON.parse(localStorage.getItem('completedBooksList'));
    }

    var html = '';

    completedBooksList.forEach(function(element) {
        html += '<tr>';
        html += '<td>' + element.title + '</td>';
        html += '<td>' + element.author + '</td>';
        html += '<td>' + element.year + '</td>';
        html += '<td><button onclick="deleteCompletedData(\'' + element.id + '\')" class="badge text-bg-danger">Remove</button>';
        html += '<button onclick="moveToUncompleted(\'' + element.id + '\')" class="badge text-bg-info m-2">Kembali</button></td>';

        html += '</tr>';
    });

    document.querySelector('#readTable tbody').innerHTML = html;
}

document.addEventListener('DOMContentLoaded', function() {
    showData();
    showCompletedData();
});






