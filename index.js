const dailyPlan = [
    {
        time: "5:00 AM",
        activity: "Wake up, perform Fajr prayer",
    },
    {
        time: "5:15 AM - 6:00 AM",
        activity: "Commute to the gym",
    },
    {
        time: "6:00 AM - 7:00 AM",
        activity: "Gym workout",
    },
    {
        time: "7:00 AM - 7:30 AM",
        activity: "Shower and change",
    },
    {
        time: "7:30 AM - 8:00 AM",
        activity: "Commute to work",
    },
    {
        time: "8:00 AM - 10:00 AM",
        activity: "Focus on high-priority work tasks",
    },
    {
        time: "10:00 AM - 12:00 PM",
        activity: "Regular work tasks",
    },
    {
        time: "12:00 PM - 1:00 PM",
        activity: "Lunch break, perform Dhuhr prayer",
    },
    {
        time: "1:00 PM - 3:00 PM",
        activity: "Regular work tasks",
    },
    {
        time: "3:00 PM - 4:00 PM",
        activity: "Afternoon prayer (Asr)",
    },
    {
        time: "4:00 PM - 6:00 PM",
        activity: "Wrap up tasks",
    },
    {
        time: "6:00 PM - 7:00 PM",
        activity: "Commute home, perform Maghrib prayer",
    },
    {
        time: "7:00 PM - 8:00 PM",
        activity: "Dinner and relaxation",
    },
    {
        time: "8:00 PM - 9:00 PM",
        activity: "Learn React.js",
    },
    {
        time: "9:00 PM - 10:00 PM",
        activity: "Light reading, prepare for sleep",
    },
    {
        time: "10:00 PM",
        activity: "Perform Isha prayer, sleep",
    },
];
function showNotification(activity) {
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
        var notification = new Notification("Upcoming Event", {
            body: activity,
        });
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(function (permission) {
            if (permission === "granted") {
                var notification = new Notification("Upcoming Event", {
                    body: activity,
                });
            }
        });
    }
}
function parseTime(timeString) {
    // Split the timeString into hours, minutes, and period (AM/PM)
    const [time, period] = timeString.split(' ');
    const [hours, minutes] = time.split(':').map(Number);

    // Convert hours to 24-hour format if necessary
    let adjustedHours = hours;
    if (period === "PM" && hours < 12) {
        adjustedHours += 12;
    } else if (period === "AM" && hours === 12) {
        adjustedHours = 0;
    }

    // Create a new Date object with the parsed time
    const currentDate = new Date();
    currentDate.setHours(adjustedHours, minutes, 0, 0);

    return currentDate;
}

function getNextDayStartTime() {
    const currentTime = new Date();
    const tomorrow = new Date(currentTime);
    tomorrow.setDate(tomorrow.getDate() + 1); // Set to tomorrow
    tomorrow.setHours(0, 0, 0, 0); // Set to midnight
    return tomorrow.getTime();
}



function checkSchedule() {
    var currentTime = new Date().getTime();
    dailyPlan.forEach(function (item) {
        const eventTime = parseTime(item.time)
        if (eventTime > currentTime && eventTime - currentTime <= 60000) {
            // Check if notifications are enabled
            if (localStorage.getItem('notificationPreference') === 'granted') {
                showNotification(item.activity);
            }
        }
    });
}

// Check schedule every minute
function displaySchedule() {
    var currentTime = new Date().getTime();
    var upcomingEventIndex = -1;

    dailyPlan.forEach(function (item, index) {
        const eventTime = parseTime(item.time)

        if (eventTime > currentTime && upcomingEventIndex === -1) {
            upcomingEventIndex = index;
        }
    });

    // Highlight the current event if it exists
    var tableRows = document.querySelectorAll('table tr');
    tableRows.forEach(function (row, index) {
        if (index === upcomingEventIndex) {
            row.classList.add('currentEvent') // Highlight upcoming event
        } else if (index === upcomingEventIndex + 1) {
            // row.classList.add('upcomingEvent') // Highlight current event

        } else {
            row.style.backgroundColor = ''; // Reset background color for other rows
        }
    });

    // Scroll to the current event if it exists
    if (upcomingEventIndex > 0) {
        tableRows[upcomingEventIndex - 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}


// Check schedule every minute and display the schedule
setInterval(function () {
    checkSchedule();
    displaySchedule();
}, 2 * 60000);
// Request permission for notifications and save preference to local storage
if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(function (permission) {
        localStorage.setItem('notificationPreference', permission);
    });
}
const tableBody = document.querySelector('table');

dailyPlan.forEach(row => {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `<td>${row.time}</td><td>${row.activity}</td>`;
    tableBody.appendChild(newRow);
});
displaySchedule();

// Function to toggle dark or light mode
function toggleDarkMode() {
    // Toggle the dark mode class on the body
    document.body.classList.toggle("dark-mode");

    // Toggle the icon between sun and moon based on mode
    const modeIcon = document.getElementById("modeIcon");
    if (document.body.classList.contains("dark-mode")) {
        modeIcon.innerHTML = "🌞"; // Sun icon
    } else {
        modeIcon.innerHTML = "🌙"; // Moon icon
    }

    // Save the current mode preference to local storage
    const isDarkMode = document.body.classList.contains("dark-mode");
    localStorage.setItem("darkMode", isDarkMode);
}

// Check and apply dark mode preference when the page loads
window.onload = function () {
    const darkMode = localStorage.getItem("darkMode");
    if (darkMode === "true") {
        document.body.classList.add("dark-mode");
        document.getElementById("modeIcon").innerHTML = "🌞"; // Sun icon when dark mode is active
    }
};
