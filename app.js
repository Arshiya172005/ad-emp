// Mock data for users
const users = [
    { username: 'admin', role: 'admin' },
    { username: 'employee', role: 'employee' }
];

let employees = [];
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let employeeTasks = [];
let leaveRequests = JSON.parse(localStorage.getItem('leaveRequests')) || [];

// Login functionality
function login() {
    const username = document.getElementById('username').value;

    const user = users.find(user => user.username === username);

    if (user) {
        localStorage.setItem('role', user.role);
        showDashboard(user.role);
    } else {
        document.getElementById('login-error').textContent = 'Invalid username or password';
    }
}

// Show the correct dashboard based on role
function showDashboard(role) {
    document.getElementById('login-page').style.display = 'none';

    if (role === 'admin') {
        document.getElementById('admin-dashboard').style.display = 'block';
    } else if (role === 'employee') {
        document.getElementById('employee-dashboard').style.display = 'block';
        renderEmployeeTasks();
    }
}

// Logout functionality
function logout() {
    localStorage.removeItem('role'); 
    window.location.href = 'index.html'; 
}

// Show Employee Settings (Admin functionality)
function showEmployeeSettings() {
    const adminContent = document.getElementById('admin-content');
    adminContent.innerHTML = `
        <div class="dashboard-section">
            <h2>Add Employee</h2>
            <input type="text" id="new-employee" placeholder="Enter new employee username">
            <button class="blue-button" onclick="addEmployee()">Add Employee</button>
            <button class="back-button" onclick="backToAdmin()">Back</button>
        </div>
    `;
}

// Add new employee functionality
function addEmployee() {
    const newEmployee = document.getElementById('new-employee').value;
    if (newEmployee) {
        employees.push(newEmployee);
        alert(`Employee ${newEmployee} added successfully!`);
        document.getElementById('new-employee').value = '';
    }
}

// View Leave Requests (Admin functionality)
function viewLeaveRequests() {
    const adminContent = document.getElementById('admin-content');
    adminContent.innerHTML = `
        <div class="dashboard-section">
            <h2>Leave Requests</h2>
            <ul id="leave-requests-list"></ul>
            <button class="back-button" onclick="backToAdmin()">Back</button>
        </div>
    `;
    renderLeaveRequests();
}

// Render leave requests for admin
function renderLeaveRequests() {
    const leaveRequestsList = document.getElementById('leave-requests-list');
    leaveRequestsList.innerHTML = '';
    leaveRequests.forEach((request, index) => {
        const li = document.createElement('li');
        li.textContent = `From: ${request.start} To: ${request.end} - Status: ${request.status}`;
        const acceptButton = document.createElement('button');
        acceptButton.textContent = 'Accept';
        acceptButton.onclick = () => acceptLeave(index);
        
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = () => removeLeave(index);

        li.appendChild(acceptButton);
        li.appendChild(removeButton);
        leaveRequestsList.appendChild(li);
    });
}

// Accept leave request
function acceptLeave(index) {
    leaveRequests[index].status = 'Accepted';
    localStorage.setItem('leaveRequests', JSON.stringify(leaveRequests));
    renderLeaveRequests();
}

// Remove leave request
function removeLeave(index) {
    leaveRequests.splice(index, 1);
    localStorage.setItem('leaveRequests', JSON.stringify(leaveRequests));
    renderLeaveRequests();
}

// Assign Task functionality (Admin)
function assignTask() {
    const adminContent = document.getElementById('admin-content');
    adminContent.innerHTML = `
        <div class="dashboard-section">
            <h2>Assign Task to Employee</h2>
            <input type="text" id="task" placeholder="Enter task description">
            <input type="text" id="employee" placeholder="Enter employee username">
            <button class="blue-button" onclick="addTask()">Assign Task</button>
            <button class="back-button" onclick="backToAdmin()">Back</button>
        </div>
    `;
}

// Add task to employee
function addTask() {
    const taskDescription = document.getElementById('task').value;
    const employeeUsername = document.getElementById('employee').value;

    if (taskDescription && employeeUsername) {
        tasks.push(taskDescription);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        alert(`Task assigned to ${employeeUsername}!`);
        document.getElementById('task').value = '';
        document.getElementById('employee').value = '';
    } else {
        alert('Please enter both task description and employee username.');
    }
}

// Back to Admin Dashboard
function backToAdmin() {
    const adminContent = document.getElementById('admin-content');
    adminContent.innerHTML = `
        <div class="dashboard-section">
            <h2>Admin Settings</h2>
            <button class="blue-button" onclick="showEmployeeSettings()">Employee Settings</button>
            <button class="blue-button" onclick="viewLeaveRequests()">View Leave Requests</button>
            <button class="blue-button" onclick="assignTask()">Assign Task</button>
        </div>
    `;
}

// Render employee's assigned tasks
function renderEmployeeTasks() {
    const employeeTaskList = document.getElementById('employee-task-list');
    employeeTaskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task;
        employeeTaskList.appendChild(li);
    });
}

// Submit work report
function submitReport() {
    const report = document.getElementById('work-report').value;
    if (report) {
        document.getElementById('work-report').value = '';
        document.getElementById('report-status').textContent = 'Report submitted successfully!';
    }
}

// Request leave
function requestLeave() {
    const start = document.getElementById('leave-start').value;
    const end = document.getElementById('leave-end').value;
    if (start && end) {
        const request = { start, end, status: 'Pending' };
        leaveRequests.push(request);
        localStorage.setItem('leaveRequests', JSON.stringify(leaveRequests));
        document.getElementById('leave-start').value = '';
        document.getElementById('leave-end').value = '';
        alert('Leave request submitted!');
    }
}

// Check for session on page load
document.addEventListener('DOMContentLoaded', () => {
    const role = localStorage.getItem('role');
    if (role) {
        showDashboard(role);
    }
});
