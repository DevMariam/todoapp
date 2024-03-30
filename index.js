// Get the input, ul, and form elements
const taskInput = document.getElementById('taskInput');
const reminderInput = document.getElementById('reminderInput');
const noteInput = document.getElementById('noteInput');
const ul = document.getElementById('list');
const form = document.getElementById('form');
const calendar = document.getElementById('calendar');
const searchInput = document.getElementById('searchInput');
const sortByName = document.getElementById('sortByName');
const sortByReminderDate = document.getElementById('sortByReminderDate');
// Object to store selected reminder times
const selectedReminderTimes = {};

// Function to add zero padding
function padZero(num) {
    return num < 10 ? '0' + num : num;
}

// Function to update calendar
function updateCalendar() {
    const currentDate = new Date();
    const dateString = currentDate.toDateString();
    const timeString = padZero(currentDate.getHours()) + ':' + padZero(currentDate.getMinutes());
    calendar.innerHTML = `Today is ${dateString},  Current time is ${timeString}.`;
}

// Update calendar on load
updateCalendar();

// Function to set focus to task input
function focusTaskInput() {
    taskInput.focus();
}

// Add event listener to the form
form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get the user input values for task, reminder, and note
    const taskText = taskInput.value;
    const reminderTime = new Date(reminderInput.value);
    const noteText = noteInput.value;

    // Check if reminder time is in the past
    if (reminderTime < new Date()) {
        alert('Error: Selected date has passed the current date.');
        return;
    }

    // Check if reminder time is already set for another task
    if (selectedReminderTimes[reminderTime.getTime()]) {
        alert('Error: Another task is already set for this time.');
        return;
    }

    // Store the selected reminder time
    selectedReminderTimes[reminderTime.getTime()] = true;

    // Create a new li element
    const li = document.createElement('li');

    // Create span elements for task, reminder, and note
    const taskSpan = document.createElement('span');
    taskSpan.textContent = `${taskText}`;

    const reminderSpan = document.createElement('span');
    reminderSpan.textContent = `(Reminder: ${reminderTime.toLocaleString()})`;

    // Append task and reminder spans to the li element
    li.appendChild(taskSpan);
    li.appendChild(reminderSpan);

    // If note is provided, create a span element for the note
    if (noteText.trim() !== '') {
        const noteSpan = document.createElement('span');
        noteSpan.textContent = ` - Note: ${noteText}`;
        li.appendChild(noteSpan);
    }

    // Create edit button
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', function() {
        taskInput.value = taskText;
        reminderInput.value = reminderTime.toISOString().slice(0, 16);
        noteInput.value = noteText;
        delete selectedReminderTimes[reminderTime.getTime()];
        li.remove();
    });

    // Create delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function() {
        delete selectedReminderTimes[reminderTime.getTime()];
        li.remove();
    });

    // Append edit and delete buttons to the li element
    li.appendChild(editButton);
    li.appendChild(deleteButton);

    // Append the li element to the ul
    ul.appendChild(li);

    // Clear the input fields
    taskInput.value = '';
    reminderInput.value = '';
    noteInput.value = '';

    // Set focus to the task input for convenience
    focusTaskInput();
});

// Function to check reminders
function checkReminders() {
    const currentDate = new Date();
    const lis = ul.querySelectorAll('li');
    lis.forEach(li => {
        const reminderTime = new Date(li.getAttribute('data-reminder'));
        if (currentDate >= reminderTime) {
            // Here you can implement your reminder action, such as displaying a notification
            console.log(`Reminder: ${li.textContent} at ${reminderTime}`);
            // Optionally, remove the reminder from the list once triggered
            ul.removeChild(li);
            delete selectedReminderTimes[reminderTime.getTime()];
        }
    });
}


// Function to sort tasks by task name
function sortTasksByName() {
    const sortedTasks = Array.from(ul.children).sort((a, b) => {
        const taskA = a.querySelector('span:first-child').textContent.toLowerCase();
        const taskB = b.querySelector('span:first-child').textContent.toLowerCase();
        return taskA.localeCompare(taskB);
    });
    ul.innerHTML = '';
    sortedTasks.forEach(task => ul.appendChild(task));
}

// Function to sort tasks by reminder date
function sortTasksByReminderDate() {
    const sortedTasks = Array.from(ul.children).sort((a, b) => {
        const reminderTimeA = new Date(a.querySelector('span:nth-child(2)').textContent.slice(11));
        const reminderTimeB = new Date(b.querySelector('span:nth-child(2)').textContent.slice(11));
        return reminderTimeA - reminderTimeB;
    });
    ul.innerHTML = '';
    sortedTasks.forEach(task => ul.appendChild(task));
}

// Function to add event listener for sorting buttons
function addSortingEventListeners() {
    const sortByNameButton = document.getElementById('sortByName');
    const sortByReminderDateButton = document.getElementById('sortByReminderDate');

    sortByNameButton.addEventListener('click', sortTasksByName);
    sortByReminderDateButton.addEventListener('click', sortTasksByReminderDate);
}

// Function to filter tasks by keyword
function filterTasksByKeyword(keyword) {
    const filteredTasks = Array.from(ul.children).filter(task => {
        const taskText = task.textContent.toLowerCase();
        return taskText.includes(keyword.toLowerCase());
    });
    ul.innerHTML = '';
    filteredTasks.forEach(task => ul.appendChild(task));
}

// Function to add event listener for search input
function addSearchEventListener() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function() {
        filterTasksByKeyword(this.value);
    });
}

// Call the function to add event listener for search input
addSearchEventListener();


// Call the function to add event listeners for sorting
addSortingEventListeners();

// Check reminders every minute
// setInterval(checkReminders, 60000); // Adjust the interval as needed

// Set focus to the task input on page load
focusTaskInput();
