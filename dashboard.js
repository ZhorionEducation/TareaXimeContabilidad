// ==================== DATOS CON LOCALSTORAGE ====================

// Datos iniciales (quemados)
const INITIAL_EMPLOYEES = [
    {
        id: 1,
        cedula: '1001234567',
        nombre: 'Carlos Rodríguez',
        puesto: 'Desarrollador Senior',
        salario: 3500000,
        estado: 'pendiente'
    },
    {
        id: 2,
        cedula: '1002345678',
        nombre: 'María García',
        puesto: 'Gerente de Proyecto',
        salario: 4200000,
        estado: 'pagado'
    },
    {
        id: 3,
        cedula: '1003456789',
        nombre: 'Juan López',
        puesto: 'Analista',
        salario: 2800000,
        estado: 'pendiente'
    },
    {
        id: 4,
        cedula: '1004567890',
        nombre: 'Andrea Martínez',
        puesto: 'Diseñadora UI/UX',
        salario: 3100000,
        estado: 'pendiente'
    },
    {
        id: 5,
        cedula: '1005678901',
        nombre: 'Luis Sánchez',
        puesto: 'DevOps',
        salario: 3700000,
        estado: 'pagado'
    },
    {
        id: 6,
        cedula: '1006789012',
        nombre: 'Sandra Torres',
        puesto: 'QA Tester',
        salario: 2500000,
        estado: 'pendiente'
    }
];

// Variable para almacenar empleados en memoria
let employees = [];

// Cargar employados de localStorage o usar datos iniciales
function initializeEmployees() {
    const stored = localStorage.getItem('employees');
    if (stored) {
        employees = JSON.parse(stored);
    } else {
        employees = JSON.parse(JSON.stringify(INITIAL_EMPLOYEES));
        saveEmployees();
    }
}

// Guardar empleados en localStorage
function saveEmployees() {
    localStorage.setItem('employees', JSON.stringify(employees));
}

// ==================== DESCUENTOS ====================

const DEDUCTIONS = {
    socialSecurity: 0.105,    // 10.5%
    incomeTax: 0.08,          // 8%
    otherDeductions: 0.02     // 2%
};

// ==================== VERIFICACIÓN DE SESIÓN ====================

window.addEventListener('load', () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Mostrar nombre del usuario
    document.getElementById('userName').textContent = user.username;

    // Inicializar empleados desde localStorage
    initializeEmployees();

    // Inicializar la aplicación
    initApp();
});

// ==================== INICIALIZACIÓN ====================

function initApp() {
    // Cargar datos en el dashboard
    loadDashboard();

    // Cargar empleados en la tabla
    loadEmployees();

    // Cargar empleados en el selector de la calculadora
    loadEmployeeSelector();

    // Event listeners para las pestañas
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', switchTab);
    });

    // Event listener para cerrar sesión
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Event listener para exportar a Excel
    document.getElementById('exportBtn').addEventListener('click', exportToExcel);

    // Event listener para seleccionar empleado en calculadora
    document.getElementById('employeeSelect').addEventListener('change', calculateDeductions);

    // Event listener para exportar recibo del empleado
    document.getElementById('exportReceiptBtn').addEventListener('click', exportReceipt);

    // Event listeners para el modal
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('employeeModal').addEventListener('click', (e) => {
        if (e.target.id === 'employeeModal') {
            closeModal();
        }
    });

    // Event listeners para agregar empleado
    document.getElementById('addEmployeeBtn').addEventListener('click', openAddEmployeeModal);
    document.getElementById('closeAddEmployeeModal').addEventListener('click', closeAddEmployeeModal);
    document.getElementById('cancelAddEmployee').addEventListener('click', closeAddEmployeeModal);
    document.getElementById('addEmployeeForm').addEventListener('submit', handleAddEmployee);
    document.getElementById('addEmployeeModal').addEventListener('click', (e) => {
        if (e.target.id === 'addEmployeeModal') {
            closeAddEmployeeModal();
        }
    });

    // Event listeners para editar empleado
    document.getElementById('closeEditEmployeeModal').addEventListener('click', closeEditEmployeeModal);
    document.getElementById('cancelEditEmployee').addEventListener('click', closeEditEmployeeModal);
    document.getElementById('editEmployeeForm').addEventListener('submit', handleEditEmployee);
    document.getElementById('editEmployeeModal').addEventListener('click', (e) => {
        if (e.target.id === 'editEmployeeModal') {
            closeEditEmployeeModal();
        }
    });
}

// ==================== DASHBOARD ====================

function loadDashboard() {
    // Calcular totales
    const totalEmployees = employees.length;
    const totalPayroll = employees.reduce((sum, emp) => sum + emp.salario, 0);
    const totalDiscounts = employees.reduce((sum, emp) => {
        const deductions = calculateDeductionsAmount(emp.salario);
        return sum + deductions;
    }, 0);
    const totalNet = totalPayroll - totalDiscounts;

    // Actualizar elementos del DOM
    document.getElementById('totalEmployees').textContent = totalEmployees;
    document.getElementById('totalPayroll').textContent = formatCurrency(totalPayroll);
    document.getElementById('totalDiscounts').textContent = formatCurrency(totalDiscounts);
    document.getElementById('totalNet').textContent = formatCurrency(totalNet);

    // Agregar animación de números
    animateNumbers();
}

function animateNumbers() {
    const stats = document.querySelectorAll('.stat-value');
    stats.forEach((stat, index) => {
        stat.style.animation = `none`;
        setTimeout(() => {
            stat.style.animation = `slideUp 0.6s ease-out ${index * 0.1}s both`;
        }, 10);
    });
}

// ==================== EMPLEADOS ====================

function loadEmployees() {
    const tbody = document.getElementById('employeesList');
    tbody.innerHTML = '';

    employees.forEach((employee, index) => {
        const row = document.createElement('tr');
        row.style.animation = `fadeIn 0.5s ease-out ${index * 0.05}s both`;
        
        const statusClass = employee.estado === 'pendiente' ? 'status-pending' : 'status-paid';
        const statusIcon = employee.estado === 'pendiente' ? 'fa-hourglass-half' : 'fa-check-circle';
        const statusText = employee.estado === 'pendiente' ? 'Pendiente' : 'Pagado';
        
        row.innerHTML = `
            <td data-label="Cédula">${employee.cedula}</td>
            <td data-label="Nombre" class="employee-name">${employee.nombre}</td>
            <td data-label="Puesto">${employee.puesto}</td>
            <td data-label="Salario Base" class="employee-salary">${formatCurrency(employee.salario)}</td>
            <td data-label="Estado">
                <span class="status-badge ${statusClass}">
                    <i class="fas ${statusIcon}"></i>
                    ${statusText}
                </span>
            </td>
            <td data-label="Acciones">
                <div class="action-buttons">
                    <button class="details-btn" onclick="showEmployeeDetails(${employee.id})">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                    <button class="edit-btn" onclick="openEditEmployeeModal(${employee.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <select class="status-select" onchange="changeEmployeeStatus(${employee.id}, this.value)">
                        <option value="pendiente" ${employee.estado === 'pendiente' ? 'selected' : ''}>
                            Pendiente
                        </option>
                        <option value="pagado" ${employee.estado === 'pagado' ? 'selected' : ''}>
                            Pagado
                        </option>
                    </select>
                    <button class="delete-btn" onclick="deleteEmployee(${employee.id})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function showEmployeeDetails(employeeId) {
    const employee = employees.find(e => e.id === employeeId);
    if (!employee) return;

    const deductionsAmount = calculateDeductionsAmount(employee.salario);
    const netSalary = employee.salario - deductionsAmount;

    const breakdown = calculateDeductionsBreakdown(employee.salario);

    const statusClass = employee.estado === 'pendiente' ? 'status-pending' : 'status-paid';
    const statusIcon = employee.estado === 'pendiente' ? 'fa-hourglass-half' : 'fa-check-circle';
    const statusText = employee.estado === 'pendiente' ? 'Pendiente de Pago' : 'Pagado';

    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="modal-row">
            <span class="modal-label">Cédula</span>
            <span class="modal-value">${employee.cedula}</span>
        </div>
        <div class="modal-row">
            <span class="modal-label">Nombre</span>
            <span class="modal-value">${employee.nombre}</span>
        </div>
        <div class="modal-row">
            <span class="modal-label">Puesto</span>
            <span class="modal-value">${employee.puesto}</span>
        </div>
        <div class="modal-row">
            <span class="modal-label">Estado</span>
            <span class="modal-value" style="display: inline-flex; align-items: center; gap: 6px;">
                <i class="fas ${statusIcon}" style="color: ${employee.estado === 'pendiente' ? '#fbbf24' : '#86efac'};"></i>
                ${statusText}
            </span>
        </div>
        <div class="modal-row">
            <span class="modal-label" style="color: #86efac;">Salario Base</span>
            <span class="modal-value" style="color: #86efac;">${formatCurrency(employee.salario)}</span>
        </div>
        <div class="modal-row">
            <span class="modal-label">Seguro Social (10.5%)</span>
            <span class="modal-value">${formatCurrency(breakdown.socialSecurity)}</span>
        </div>
        <div class="modal-row">
            <span class="modal-label">Impuesto Renta (8%)</span>
            <span class="modal-value">${formatCurrency(breakdown.incomeTax)}</span>
        </div>
        <div class="modal-row">
            <span class="modal-label">Otros Descuentos (2%)</span>
            <span class="modal-value">${formatCurrency(breakdown.otherDeductions)}</span>
        </div>
        <div class="modal-row">
            <span class="modal-label" style="color: #fca5a5;">Total Descuentos</span>
            <span class="modal-value" style="color: #fca5a5;">${formatCurrency(deductionsAmount)}</span>
        </div>
        <div class="modal-row">
            <span class="modal-label" style="color: #60a5fa; font-weight: 700;">Salario Neto</span>
            <span class="modal-value" style="color: #60a5fa; font-size: 20px;">${formatCurrency(netSalary)}</span>
        </div>
    `;

    document.getElementById('employeeModal').classList.add('show');
}

function changeEmployeeStatus(employeeId, newStatus) {
    const employee = employees.find(e => e.id === employeeId);
    if (!employee) return;

    const oldStatus = employee.estado;
    employee.estado = newStatus;

    // Guardar en localStorage
    saveEmployees();

    // Actualizar tabla
    loadEmployees();

    // Actualizar dashboard
    loadDashboard();

    // Mostrar notificación
    const message = newStatus === 'pagado' 
        ? `Pago registrado para ${employee.nombre}` 
        : `Estado actualizado para ${employee.nombre}`;
    showNotification(message, 'success');
}

function markAsPaid(employeeId) {
    const employee = employees.find(e => e.id === employeeId);
    if (!employee) return;

    // Cambiar estado a pagado
    employee.estado = 'pagado';

    // Guardar en localStorage
    saveEmployees();

    // Actualizar tabla
    loadEmployees();

    // Actualizar dashboard
    loadDashboard();

    // Mostrar notificación
    showPaymentNotification(employee.nombre);
}

function showPaymentNotification(employeeName) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 30px;
        background: linear-gradient(135deg, #10b981, #065f46);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
        font-weight: 600;
        z-index: 2000;
        animation: slideUp 0.3s ease-out;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 400px;
    `;
    notification.innerHTML = `<i class="fas fa-check-circle"></i> Pago registrado para ${employeeName}`;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease-in forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ==================== AGREGAR EMPLEADO ====================

function openAddEmployeeModal() {
    document.getElementById('addEmployeeModal').classList.add('show');
    clearAddEmployeeForm();
}

function closeAddEmployeeModal() {
    document.getElementById('addEmployeeModal').classList.remove('show');
    clearAddEmployeeForm();
}

function clearAddEmployeeForm() {
    document.getElementById('addEmployeeForm').reset();
    clearFormErrors();
}

function clearFormErrors() {
    document.getElementById('cedulaError').textContent = '';
    document.getElementById('nombreError').textContent = '';
    document.getElementById('puestoError').textContent = '';
    document.getElementById('salarioError').textContent = '';
}

function validateAddEmployeeForm() {
    clearFormErrors();
    let isValid = true;

    const cedula = document.getElementById('newCedula').value.trim();
    const nombre = document.getElementById('newNombre').value.trim();
    const puesto = document.getElementById('newPuesto').value.trim();
    const salario = document.getElementById('newSalario').value;

    // Validar cédula
    if (!cedula) {
        document.getElementById('cedulaError').textContent = 'La cédula es requerida';
        isValid = false;
    } else if (!/^\d{10}$/.test(cedula)) {
        document.getElementById('cedulaError').textContent = 'La cédula debe tener 10 dígitos';
        isValid = false;
    } else if (employees.some(e => e.cedula === cedula)) {
        document.getElementById('cedulaError').textContent = 'Esta cédula ya está registrada';
        isValid = false;
    }

    // Validar nombre
    if (!nombre) {
        document.getElementById('nombreError').textContent = 'El nombre es requerido';
        isValid = false;
    } else if (nombre.length < 3) {
        document.getElementById('nombreError').textContent = 'El nombre debe tener al menos 3 caracteres';
        isValid = false;
    }

    // Validar puesto
    if (!puesto) {
        document.getElementById('puestoError').textContent = 'El puesto es requerido';
        isValid = false;
    }

    // Validar salario
    if (!salario) {
        document.getElementById('salarioError').textContent = 'El salario es requerido';
        isValid = false;
    } else if (parseInt(salario) <= 0) {
        document.getElementById('salarioError').textContent = 'El salario debe ser mayor a 0';
        isValid = false;
    }

    return isValid;
}

function handleAddEmployee(e) {
    e.preventDefault();

    if (!validateAddEmployeeForm()) {
        return;
    }

    const cedula = document.getElementById('newCedula').value.trim();
    const nombre = document.getElementById('newNombre').value.trim();
    const puesto = document.getElementById('newPuesto').value.trim();
    const salario = parseInt(document.getElementById('newSalario').value);

    // Obtener nuevo ID
    const newId = Math.max(...employees.map(e => e.id), 0) + 1;

    // Crear nuevo empleado
    const newEmployee = {
        id: newId,
        cedula: cedula,
        nombre: nombre,
        puesto: puesto,
        salario: salario,
        estado: 'pendiente'
    };

    // Agregar al array de empleados
    employees.push(newEmployee);

    // Guardar en localStorage
    saveEmployees();

    // Actualizar interfaz
    loadEmployees();
    loadEmployeeSelector();
    loadDashboard();

    // Cerrar modal
    closeAddEmployeeModal();

    // Mostrar notificación
    showAddEmployeeNotification(nombre);
}

function showAddEmployeeNotification(employeeName) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 30px;
        background: linear-gradient(135deg, #6366f1, #4f46e5);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
        font-weight: 600;
        z-index: 2000;
        animation: slideUp 0.3s ease-out;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 400px;
    `;
    notification.innerHTML = `<i class="fas fa-user-check"></i> Empleado ${employeeName} agregado exitosamente`;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease-in forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ==================== ELIMINAR EMPLEADO ====================

function deleteEmployee(employeeId) {
    const employee = employees.find(e => e.id === employeeId);
    if (!employee) return;

    Swal.fire({
        title: '¿Eliminar empleado?',
        text: `¿Estás seguro de que deseas eliminar a ${employee.nombre}? Esta acción no se puede deshacer.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        customClass: {
            popup: 'swal-popup',
            confirmButton: 'swal-confirm-btn',
            cancelButton: 'swal-cancel-btn'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            employees = employees.filter(e => e.id !== employeeId);
            saveEmployees();
            loadEmployees();
            loadEmployeeSelector();
            loadDashboard();
            showNotification('Empleado eliminado exitosamente', 'success');
        }
    });
}

// ==================== EDITAR EMPLEADO ====================

function openEditEmployeeModal(employeeId) {
    const employee = employees.find(e => e.id === employeeId);
    if (!employee) return;

    document.getElementById('editEmployeeId').value = employee.id;
    document.getElementById('editCedula').value = employee.cedula;
    document.getElementById('editNombre').value = employee.nombre;
    document.getElementById('editPuesto').value = employee.puesto;
    document.getElementById('editSalario').value = employee.salario;

    document.getElementById('editEmployeeModal').classList.add('show');
}

function closeEditEmployeeModal() {
    document.getElementById('editEmployeeModal').classList.remove('show');
    document.getElementById('editEmployeeForm').reset();
    clearEditFormErrors();
}

function clearEditFormErrors() {
    document.getElementById('editCedulaError').textContent = '';
    document.getElementById('editNombreError').textContent = '';
    document.getElementById('editPuestoError').textContent = '';
    document.getElementById('editSalarioError').textContent = '';
}

function validateEditEmployeeForm() {
    clearEditFormErrors();
    let isValid = true;

    const employeeId = parseInt(document.getElementById('editEmployeeId').value);
    const cedula = document.getElementById('editCedula').value.trim();
    const nombre = document.getElementById('editNombre').value.trim();
    const puesto = document.getElementById('editPuesto').value.trim();
    const salario = document.getElementById('editSalario').value;
    const currentEmployee = employees.find(e => e.id === employeeId);

    // Validar cédula
    if (!cedula) {
        document.getElementById('editCedulaError').textContent = 'La cédula es requerida';
        isValid = false;
    } else if (!/^\d{10}$/.test(cedula)) {
        document.getElementById('editCedulaError').textContent = 'La cédula debe tener 10 dígitos';
        isValid = false;
    } else if (cedula !== currentEmployee.cedula && employees.some(e => e.cedula === cedula)) {
        document.getElementById('editCedulaError').textContent = 'Esta cédula ya está registrada';
        isValid = false;
    }

    // Validar nombre
    if (!nombre) {
        document.getElementById('editNombreError').textContent = 'El nombre es requerido';
        isValid = false;
    } else if (nombre.length < 3) {
        document.getElementById('editNombreError').textContent = 'El nombre debe tener al menos 3 caracteres';
        isValid = false;
    }

    // Validar puesto
    if (!puesto) {
        document.getElementById('editPuestoError').textContent = 'El puesto es requerido';
        isValid = false;
    }

    // Validar salario
    if (!salario) {
        document.getElementById('editSalarioError').textContent = 'El salario es requerido';
        isValid = false;
    } else if (parseInt(salario) <= 0) {
        document.getElementById('editSalarioError').textContent = 'El salario debe ser mayor a 0';
        isValid = false;
    }

    return isValid;
}

function handleEditEmployee(e) {
    e.preventDefault();

    if (!validateEditEmployeeForm()) {
        return;
    }

    const employeeId = parseInt(document.getElementById('editEmployeeId').value);
    const cedula = document.getElementById('editCedula').value.trim();
    const nombre = document.getElementById('editNombre').value.trim();
    const puesto = document.getElementById('editPuesto').value.trim();
    const salario = parseInt(document.getElementById('editSalario').value);

    const employee = employees.find(e => e.id === employeeId);
    if (!employee) return;

    employee.cedula = cedula;
    employee.nombre = nombre;
    employee.puesto = puesto;
    employee.salario = salario;

    saveEmployees();
    loadEmployees();
    loadEmployeeSelector();
    loadDashboard();
    closeEditEmployeeModal();
    showNotification(`Empleado ${nombre} actualizado exitosamente`, 'success');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const bgGradient = type === 'success' 
        ? 'linear-gradient(135deg, #10b981, #065f46)'
        : 'linear-gradient(135deg, #6366f1, #4f46e5)';
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-info-circle';

    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 30px;
        background: ${bgGradient};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        font-weight: 600;
        z-index: 2000;
        animation: slideUp 0.3s ease-out;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 400px;
    `;
    notification.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease-in forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function closeModal() {
    document.getElementById('employeeModal').classList.remove('show');
}

// ==================== CALCULADORA ====================

function loadEmployeeSelector() {
    const select = document.getElementById('employeeSelect');
    
    employees.forEach(employee => {
        const option = document.createElement('option');
        option.value = employee.id;
        option.textContent = `${employee.nombre} - ${employee.puesto}`;
        select.appendChild(option);
    });
}

function calculateDeductions() {
    const employeeId = parseInt(document.getElementById('employeeSelect').value);
    
    if (!employeeId) {
        // Limpiar calculadora si no hay empleado seleccionado
        document.getElementById('calcBaseSalary').textContent = '$0';
        document.getElementById('calcSocialSecurity').textContent = '$0';
        document.getElementById('calcIncomeTax').textContent = '$0';
        document.getElementById('calcOtherDeductions').textContent = '$0';
        document.getElementById('calcTotalDeductions').textContent = '$0';
        document.getElementById('calcNetSalary').textContent = '$0';
        return;
    }

    const employee = employees.find(e => e.id === employeeId);
    if (!employee) return;

    const breakdown = calculateDeductionsBreakdown(employee.salario);
    const totalDeductions = calculateDeductionsAmount(employee.salario);
    const netSalary = employee.salario - totalDeductions;

    // Actualizar valores con animación
    animateValue('calcBaseSalary', employee.salario);
    animateValue('calcSocialSecurity', breakdown.socialSecurity);
    animateValue('calcIncomeTax', breakdown.incomeTax);
    animateValue('calcOtherDeductions', breakdown.otherDeductions);
    animateValue('calcTotalDeductions', totalDeductions);
    animateValue('calcNetSalary', netSalary);
}

function animateValue(elementId, value) {
    const element = document.getElementById(elementId);
    const start = 0;
    const duration = 800;
    const startTime = performance.now();

    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.round(start + (value - start) * progress);

        element.textContent = formatCurrency(current);

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}

// ==================== FUNCIONES AUXILIARES ====================

function calculateDeductionsBreakdown(salary) {
    return {
        socialSecurity: Math.round(salary * DEDUCTIONS.socialSecurity),
        incomeTax: Math.round(salary * DEDUCTIONS.incomeTax),
        otherDeductions: Math.round(salary * DEDUCTIONS.otherDeductions)
    };
}

function calculateDeductionsAmount(salary) {
    const breakdown = calculateDeductionsBreakdown(salary);
    return breakdown.socialSecurity + breakdown.incomeTax + breakdown.otherDeductions;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// ==================== NAVEGACIÓN ====================

function switchTab(e) {
    const tabName = this.dataset.tab;

    // Remover clase active de todos los items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });

    // Remover clase active de todos los tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Agregar clase active
    this.classList.add('active');
    document.getElementById(tabName).classList.add('active');

    // Re-animar números si se va al dashboard
    if (tabName === 'dashboard') {
        setTimeout(animateNumbers, 100);
    }
}

// ==================== LOGOUT ====================

function logout() {
    sessionStorage.removeItem('user');
    window.location.href = 'login.html';
}

// ==================== EXPORTAR A EXCEL ====================

async function exportToExcel() {
    // Crear workbook
    const ExcelJS = window.ExcelJS;
    if (!ExcelJS) {
        alert('Error: ExcelJS no cargó correctamente. Intenta de nuevo.');
        return;
    }

    const workbook = new ExcelJS.Workbook();

    // ========== Hoja 1: Resumen ==========
    const summarySheet = workbook.addWorksheet('Resumen');
    summarySheet.columns = [
        { header: 'RESUMEN NÓMINAS', key: 'title', width: 30 },
        { header: '', key: 'empty', width: 20 }
    ];

    const totalPayroll = employees.reduce((sum, emp) => sum + emp.salario, 0);
    const totalDiscounts = employees.reduce((sum, emp) => sum + calculateDeductionsAmount(emp.salario), 0);
    const totalNet = totalPayroll - totalDiscounts;

    summarySheet.addRow(['', '']);
    summarySheet.addRow(['Total de Empleados', employees.length]);
    summarySheet.addRow(['Nómina Total Mensual', totalPayroll]);
    summarySheet.addRow(['Total Descuentos', totalDiscounts]);
    summarySheet.addRow(['Total a Pagar', totalNet]);

    summarySheet.getCell('A1').font = { bold: true, size: 14, color: { argb: 'FF6366F1' } };
    summarySheet.getCell('A3').font = { bold: true };
    summarySheet.getCell('A4').font = { bold: true };
    summarySheet.getCell('A5').font = { bold: true };
    summarySheet.getCell('A6').font = { bold: true };

    // ========== Hoja 2: Empleados ==========
    const employeesSheet = workbook.addWorksheet('Empleados');
    employeesSheet.columns = [
        { header: 'Cédula', key: 'cedula', width: 15 },
        { header: 'Nombre', key: 'nombre', width: 20 },
        { header: 'Puesto', key: 'puesto', width: 20 },
        { header: 'Salario Base', key: 'salario', width: 15 },
        { header: 'Seg. Social (10.5%)', key: 'socialSecurity', width: 15 },
        { header: 'Imp. Renta (8%)', key: 'incomeTax', width: 12 },
        { header: 'Otros Desc. (2%)', key: 'otherDeductions', width: 12 },
        { header: 'Total Descuentos', key: 'totalDeductions', width: 15 },
        { header: 'Salario Neto', key: 'netSalary', width: 15 }
    ];

    // Estilos para header
    employeesSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    employeesSheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF6366F1' }
    };

    // Agregar datos de empleados
    employees.forEach(emp => {
        const breakdown = calculateDeductionsBreakdown(emp.salario);
        const totalDeductions = calculateDeductionsAmount(emp.salario);
        const netSalary = emp.salario - totalDeductions;

        employeesSheet.addRow({
            cedula: emp.cedula,
            nombre: emp.nombre,
            puesto: emp.puesto,
            salario: emp.salario,
            socialSecurity: breakdown.socialSecurity,
            incomeTax: breakdown.incomeTax,
            otherDeductions: breakdown.otherDeductions,
            totalDeductions: totalDeductions,
            netSalary: netSalary
        });
    });

    // Formato de moneda
    employeesSheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
            for (let col = 4; col <= 9; col++) {
                row.getCell(col).numFmt = '$#,##0';
            }
        }
    });

    // ========== Hoja 3: Descuentos ==========
    const deductionsSheet = workbook.addWorksheet('Descuentos');
    deductionsSheet.columns = [
        { header: 'Concepto', key: 'concepto', width: 18 },
        { header: 'Descripción', key: 'descripcion', width: 35 },
        { header: 'Porcentaje', key: 'porcentaje', width: 12 },
        { header: 'Ejemplo (Salario $3,000,000)', key: 'ejemplo', width: 25 }
    ];

    const exampleSalary = 3000000;
    const exampleBreakdown = calculateDeductionsBreakdown(exampleSalary);

    deductionsSheet.addRows([
        {
            concepto: 'Seguro Social',
            descripcion: 'Aporte obligatorio al sistema de seguridad social',
            porcentaje: '10.5%',
            ejemplo: exampleBreakdown.socialSecurity
        },
        {
            concepto: 'Impuesto Renta',
            descripcion: 'Aporte fiscal al estado',
            porcentaje: '8%',
            ejemplo: exampleBreakdown.incomeTax
        },
        {
            concepto: 'Otros Descuentos',
            descripcion: 'Descuentos adicionales y retenciones',
            porcentaje: '2%',
            ejemplo: exampleBreakdown.otherDeductions
        },
        {
            concepto: '',
            descripcion: 'TOTAL',
            porcentaje: '20.5%',
            ejemplo: calculateDeductionsAmount(exampleSalary)
        }
    ]);

    deductionsSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    deductionsSheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF6366F1' }
    };

    // Descargar archivo
    const fileName = `Nominas_${new Date().toISOString().split('T')[0]}.xlsx`;
    await workbook.xlsx.writeBuffer().then(buffer => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, fileName);
        showExportNotification();
    });
}

function showExportNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: linear-gradient(135deg, #10b981, #065f46);
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
        font-weight: 600;
        z-index: 2000;
        animation: slideUp 0.3s ease-out;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    notification.innerHTML = '<i class="fas fa-check-circle"></i> Archivo exportado correctamente';
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease-in forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ==================== EFECTOS VISUALES ====================

// Exportar Recibo como PDF
function exportReceipt() {
    const employeeId = parseInt(document.getElementById('employeeSelect').value);
    
    if (!employeeId) {
        alert('Por favor selecciona un empleado');
        return;
    }

    const employee = employees.find(e => e.id === employeeId);
    if (!employee) return;

    const breakdown = calculateDeductionsBreakdown(employee.salario);
    const totalDeductions = calculateDeductionsAmount(employee.salario);
    const netSalary = employee.salario - totalDeductions;
    const date = new Date().toLocaleDateString('es-CO');

    // Crear elemento HTML para el recibo
    const receiptHTML = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: white; color: #000;">
            <!-- Header -->
            <div style="text-align: center; border-bottom: 3px solid #6366f1; padding-bottom: 20px; margin-bottom: 30px;">
                <h1 style="margin: 0; color: #6366f1; font-size: 28px;">RECIBO DE NÓMINA</h1>
                <p style="margin: 5px 0; color: #666; font-size: 12px;">Sistema de Gestión de Nóminas</p>
            </div>

            <!-- Información del Empleado -->
            <div style="background: #f5f5f5; border-left: 4px solid #6366f1; padding: 15px; margin-bottom: 25px;">
                <h3 style="margin: 0 0 12px 0; color: #333; font-size: 14px; text-transform: uppercase;">DATOS DEL EMPLEADO</h3>
                <table style="width: 100%; font-size: 13px; line-height: 1.8;">
                    <tr>
                        <td style="font-weight: bold; color: #333;">Nombre:</td>
                        <td>${employee.nombre}</td>
                    </tr>
                    <tr>
                        <td style="font-weight: bold; color: #333;">Cédula:</td>
                        <td>${employee.cedula}</td>
                    </tr>
                    <tr>
                        <td style="font-weight: bold; color: #333;">Puesto:</td>
                        <td>${employee.puesto}</td>
                    </tr>
                    <tr>
                        <td style="font-weight: bold; color: #333;">Fecha:</td>
                        <td>${date}</td>
                    </tr>
                </table>
            </div>

            <!-- Detalles del Pago -->
            <div style="margin-bottom: 25px;">
                <h3 style="margin: 0 0 12px 0; color: #333; font-size: 14px; text-transform: uppercase;">DETALLES DEL PAGO</h3>
                <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
                    <tr style="background: #f5f5f5; border: 1px solid #ddd;">
                        <td style="padding: 10px; font-weight: bold; color: #333;">Concepto</td>
                        <td style="padding: 10px; font-weight: bold; color: #333; text-align: right;">Valor</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #ddd;">
                        <td style="padding: 10px;">Salario Base</td>
                        <td style="padding: 10px; text-align: right; color: #10b981; font-weight: bold;">${formatCurrency(employee.salario)}</td>
                    </tr>
                </table>
            </div>

            <!-- Descuentos -->
            <div style="margin-bottom: 25px;">
                <h3 style="margin: 0 0 12px 0; color: #333; font-size: 14px; text-transform: uppercase;">DESCUENTOS POR LEY</h3>
                <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
                    <tr style="background: #f5f5f5; border: 1px solid #ddd;">
                        <td style="padding: 10px; font-weight: bold; color: #333;">Concepto</td>
                        <td style="padding: 10px; font-weight: bold; color: #333; text-align: center;">%</td>
                        <td style="padding: 10px; font-weight: bold; color: #333; text-align: right;">Valor</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #ddd;">
                        <td style="padding: 10px;">Seguro Social</td>
                        <td style="padding: 10px; text-align: center;">10.5%</td>
                        <td style="padding: 10px; text-align: right;">${formatCurrency(breakdown.socialSecurity)}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #ddd;">
                        <td style="padding: 10px;">Impuesto Renta</td>
                        <td style="padding: 10px; text-align: center;">8%</td>
                        <td style="padding: 10px; text-align: right;">${formatCurrency(breakdown.incomeTax)}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #ddd;">
                        <td style="padding: 10px;">Otros Descuentos</td>
                        <td style="padding: 10px; text-align: center;">2%</td>
                        <td style="padding: 10px; text-align: right;">${formatCurrency(breakdown.otherDeductions)}</td>
                    </tr>
                    <tr style="background: #fff3cd;">
                        <td style="padding: 10px; font-weight: bold; color: #333;">Total Descuentos</td>
                        <td style="padding: 10px; text-align: center; font-weight: bold;">20.5%</td>
                        <td style="padding: 10px; text-align: right; font-weight: bold; color: #d73026;">${formatCurrency(totalDeductions)}</td>
                    </tr>
                </table>
            </div>

            <!-- Resumen Final -->
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
                <p style="margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase;">SALARIO NETO A RECIBIR</p>
                <p style="margin: 0; font-size: 32px; font-weight: bold;">${formatCurrency(netSalary)}</p>
            </div>

            <!-- Footer -->
            <div style="border-top: 1px solid #ddd; padding-top: 15px; text-align: center; color: #666; font-size: 11px;">
                <p style="margin: 0; line-height: 1.6;">
                    Este recibo ha sido generado automáticamente por el Sistema de Gestión de Nóminas.<br>
                    Para dudas o aclaraciones, contacte al departamento de recursos humanos.
                </p>
            </div>
        </div>
    `;

    // Usar html2pdf para generar el PDF
    const element = document.createElement('div');
    element.innerHTML = receiptHTML;

    const opt = {
        margin: 10,
        filename: `Recibo_${employee.nombre.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };

    html2pdf().set(opt).from(element).save();
}

// ==================== EFECTOS VISUALES ====================
const styleElement = document.createElement('style');
styleElement.textContent = `
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes slideDown {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(20px);
        }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;
document.head.appendChild(styleElement);
