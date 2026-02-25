

const students = [];


function findStudentIndexById(id) {
    return students.findIndex(s => s.id === id);
}

function calculateAverage(performance) {
    if (!performance || performance.length === 0) return 0;
    const totals = performance.reduce((acc, rec) => {
        acc.math += rec.subjects.math;
        acc.english += rec.subjects.english;
        acc.science += rec.subjects.science;
        acc.social += rec.subjects.social;
        return acc;
    }, { math:0, english:0, science:0, social:0 });
    const count = performance.length * 4;
    return (totals.math + totals.english + totals.science + totals.social) / count;
}


const studentForm = document.getElementById('studentForm');
const studentTableBody = document.querySelector('#studentTable tbody');
const searchInput = document.getElementById('searchInput');
const performanceSection = document.getElementById('performanceSection');
const performanceForm = document.getElementById('performanceForm');
const detailsSection = document.getElementById('detailsSection');
const detailsContent = document.getElementById('detailsContent');


studentForm.addEventListener('submit', handleStudentSubmit);
searchInput.addEventListener('input', renderStudentList);
performanceForm.addEventListener('submit', handlePerformanceSubmit);

function handleStudentSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('studentId').value.trim();
    const name = document.getElementById('studentName').value.trim();
    const age = parseInt(document.getElementById('studentAge').value, 10);
    const gender = document.getElementById('studentGender').value;
    const formLevel = parseInt(document.getElementById('studentFormLevel').value, 10);

    if (!id || !name || isNaN(age) || !gender || isNaN(formLevel)) {
        alert('Please fill all fields correctly.');
        return;
    }

    if (findStudentIndexById(id) !== -1) {
        alert('Student ID must be unique.');
        return;
    }

    const newStudent = {
        id,
        name,
        age,
        gender,
        form: formLevel,
        performance: []
    };

    students.push(newStudent);
    studentForm.reset();
    renderStudentList();
}

function renderStudentList() {
    const query = searchInput.value.trim().toLowerCase();
    studentTableBody.innerHTML = '';

    students.forEach(s => {
        if (query && !(`${s.id}`.toLowerCase().includes(query) || s.name.toLowerCase().includes(query))) {
            return;
        }
        const avg = calculateAverage(s.performance).toFixed(2);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${s.id}</td>
            <td>${s.name}</td>
            <td>${s.form}</td>
            <td>${avg}</td>
            <td>
                <button onclick="viewDetails('${s.id}')">View</button>
                <button onclick="showPerformanceForm('${s.id}')">Performance</button>
                <button onclick="promoteStudent('${s.id}')">Promote</button>
                <button onclick="deleteStudent('${s.id}')">Delete</button>
            </td>
        `;
        studentTableBody.appendChild(tr);
    });
}

function deleteStudent(id) {
    const idx = findStudentIndexById(id);
    if (idx !== -1 && confirm('Are you sure you want to delete this student?')) {
        students.splice(idx, 1);
        renderStudentList();
        hideSections();
    }
}

function promoteStudent(id) {
    const student = students.find(s => s.id === id);
    if (!student) return;
    if (student.form < 4) {
        student.form += 1;
        renderStudentList();
        alert(`${student.name} has been promoted to Form ${student.form}.`);
    } else {
        alert(`${student.name} is already in Form 4.`);
    }
}

function viewDetails(id) {
    const student = students.find(s => s.id === id);
    if (!student) return;
    detailsContent.innerHTML = `
        <p><strong>ID:</strong> ${student.id}</p>
        <p><strong>Name:</strong> ${student.name}</p>
        <p><strong>Age:</strong> ${student.age}</p>
        <p><strong>Gender:</strong> ${student.gender}</p>
        <p><strong>Form:</strong> ${student.form}</p>
        <h3>Performance Records</h3>
        <ul>
            ${student.performance.map(rec => `
                <li>Form ${rec.form}: Math ${rec.subjects.math}, English ${rec.subjects.english}, Science ${rec.subjects.science}, Social ${rec.subjects.social}</li>
            `).join('')}
        </ul>
    `;
    hideSections();
    detailsSection.classList.remove('hidden');
}

function showPerformanceForm(id) {
    const student = students.find(s => s.id === id);
    if (!student) return;
    document.getElementById('perfStudentId').value = id;
    hideSections();
    performanceSection.classList.remove('hidden');
}

function hideSections() {
    performanceSection.classList.add('hidden');
    detailsSection.classList.add('hidden');
}

function handlePerformanceSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('perfStudentId').value;
    const formLevel = parseInt(document.getElementById('perfForm').value, 10);
    const math = parseFloat(document.getElementById('mathScore').value);
    const english = parseFloat(document.getElementById('englishScore').value);
    const science = parseFloat(document.getElementById('scienceScore').value);
    const social = parseFloat(document.getElementById('socialScore').value);

    const student = students.find(s => s.id === id);
    if (!student) return;

    const existing = student.performance.find(p => p.form === formLevel);
    const record = {
        form: formLevel,
        subjects: {
            math,
            english,
            science,
            social
        }
    };

    if (existing) {
        Object.assign(existing, record);
    } else {
        student.performance.push(record);
    }

    performanceForm.reset();
    hideSections();
    renderStudentList();
}

// initialize
renderStudentList();

