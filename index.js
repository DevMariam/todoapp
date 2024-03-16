// Get the input, ul, and form elements
const taskInput = document.getElementById('taskInput');
const reminderInput = document.getElementById('reminderInput');
const ul = document.getElementById('list');
const form = document.getElementById('form');
const calendar = document.getElementById('calendar');

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
    calendar.innerHTML = `Today is ${dateString} Current time is ${timeString}.`;
}

// Update calendar on load
updateCalendar();

// Add event listener to the form
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get the user input value and reminder time
    const taskText = taskInput.value;
    const reminderTime = new Date(reminderInput.value);
    
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
    
    // Set the todo text
    li.textContent = taskText;
    
    // Append the reminder time as a data attribute
    li.setAttribute('data-reminder', reminderTime);
    
    // Append the li element to the ul
    ul.appendChild(li);
    
    // Clear the input fields
    taskInput.value = '';
    reminderInput.value = '';
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

// Check reminders every minute
setInterval(checkReminders, 60000); // Adjust the interval as needed