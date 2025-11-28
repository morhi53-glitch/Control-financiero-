// Datos iniciales de ejemplo
const exampleTransactions = [
    {
        id: 1,
        date: '2023-10-20',
        description: 'Transporte de contenedores a Panamá',
        shipId: 1,
        type: 'income',
        amount: 8500.00
    },
    {
        id: 2,
        date: '2023-10-18',
        description: 'Combustible',
        shipId: 2,
        type: 'expense',
        amount: 4200.00,
        category: 'combustible'
    },
    {
        id: 3,
        date: '2023-10-15',
        description: 'Mantenimiento de motor',
        shipId: 3,
        type: 'expense',
        amount: 3800.00,
        category: 'mantenimiento'
    },
    {
        id: 4,
        date: '2023-10-12',
        description: 'Transporte de carga general',
        shipId: 1,
        type: 'income',
        amount: 10000.00
    }
];

const exampleShips = [
    {
        id: 1,
        name: 'Mar Azul',
        capacity: 150,
        year: 2018,
        status: 'En viaje',
        lastMaintenance: '2023-09-05',
        tripsPerYear: 12,
        utilization: 94
    },
    {
        id: 2,
        name: 'Océano Pacífico',
        capacity: 120,
        year: 2015,
        status: 'En puerto',
        lastMaintenance: '2023-08-20',
        tripsPerYear: 10,
        utilization: 87
    },
    {
        id: 3,
        name: 'Mar Caribe',
        capacity: 100,
        year: 2020,
        status: 'En viaje',
        lastMaintenance: '2023-09-15',
        tripsPerYear: 8,
        utilization: 76
    }
];

// Variables globales
let transactions = [];
let ships = [];
let editingTransactionId = null;
let editingShipId = null;

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Cargar datos desde localStorage o usar ejemplos
    loadDataFromStorage();
    
    // Configurar navegación
    setupNavigation();
    
    // Configurar formularios
    setupForms();
    
    // Configurar botones de gestión de datos
    setupDataManagement();
    
    // Cargar datos iniciales
    loadTransactions();
    loadShips();
    updateDashboard();
    updateReports();
    
    // Configurar gráficos
    setupCharts();
}

function loadDataFromStorage() {
    // Intentar cargar transacciones desde localStorage
    const storedTransactions = localStorage.getItem('maritimeTransactions');
    if (storedTransactions) {
        transactions = JSON.parse(storedTransactions);
    } else {
        // Si no hay datos, usar los ejemplos
        transactions = [...exampleTransactions];
        localStorage.setItem('maritimeTransactions', JSON.stringify(transactions));
    }
    
    // Intentar cargar barcos desde localStorage
    const storedShips = localStorage.getItem('maritimeShips');
    if (storedShips) {
        ships = JSON.parse(storedShips);
    } else {
        // Si no hay datos, usar los ejemplos
        ships = [...exampleShips];
        localStorage.setItem('maritimeShips', JSON.stringify(ships));
    }
}

function saveDataToStorage() {
    localStorage.setItem('maritimeTransactions', JSON.stringify(transactions));
    localStorage.setItem('maritimeShips', JSON.stringify(ships));
}

function setupNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover clase active de todos los enlaces
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            
            // Agregar clase active al enlace clickeado
            this.classList.add('active');
            
            // Ocultar todas las secciones
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Mostrar la sección correspondiente
            const target = this.getAttribute('data-target');
            document.getElementById(target).classList.add('active');
        });
    });
}

function setupForms() {
    // Formulario de transacciones
    const transactionForm = document.getElementById('transaction-form');
    const addTransactionBtn = document.getElementById('add-transaction-btn');
    const cancelTransactionBtn = document.getElementById('cancel-transaction');
    
    addTransactionBtn.addEventListener('click', function() {
        transactionForm.style.display = 'grid';
        editingTransactionId = null;
        transactionForm.reset();
        // Establecer fecha actual por defecto
        document.getElementById('transaction-date').valueAsDate = new Date();
        // Ocultar campo de categoría inicialmente
        document.getElementById('category-field').style.display = 'none';
        transactionForm.scrollIntoView({ behavior: 'smooth' });
    });
    
    cancelTransactionBtn.addEventListener('click', function() {
        transactionForm.style.display = 'none';
        editingTransactionId = null;
    });
    
    transactionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveTransaction();
    });
    
    // Formulario de barcos
    const shipForm = document.getElementById('ship-form');
    const addShipBtn = document.getElementById('add-ship-btn');
    const shipModal = document.getElementById('ship-modal');
    const closeShipModal = document.getElementById('close-ship-modal');
    const cancelShipForm = document.getElementById('cancel-ship-form');
    
    addShipBtn.addEventListener('click', function() {
        document.getElementById('ship-modal-title').textContent = 'Agregar Barco';
        shipForm.reset();
        // Establecer fecha actual por defecto para mantenimiento
        document.getElementById('ship-last-maintenance').valueAsDate = new Date();
        editingShipId = null;
        shipModal.style.display = 'flex';
    });
    
    closeShipModal.addEventListener('click', function() {
        shipModal.style.display = 'none';
    });
    
    cancelShipForm.addEventListener('click', function() {
        shipModal.style.display = 'none';
    });
    
    shipForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveShip();
    });
    
    // Botón de exportar PDF
    document.getElementById('export-pdf-btn').addEventListener('click', function() {
        exportToPDF();
    });
    
    // Botón de exportar Excel
    document.getElementById('export-excel-btn').addEventListener('click', function() {
        exportToExcel();
    });
}

function setupDataManagement() {
    // Botón para exportar datos
    document.getElementById('export-data').addEventListener('click', function() {
        exportData();
    });
    
    // Botón para importar datos
    document.getElementById('import-data').addEventListener('click', function() {
        document.getElementById('import-file').click();
    });
    
    document.getElementById('import-file').addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            importData(e.target.files[0]);
        }
    });
    
    // Botón para eliminar todos los datos
    document.getElementById('clear-all-data').addEventListener('click', function() {
        if (confirm('¿Está seguro de que desea eliminar TODOS los datos? Esta acción no se puede deshacer.')) {
            localStorage.removeItem('maritimeTransactions');
            localStorage.removeItem('maritimeShips');
            transactions = [];
            ships = [];
            loadTransactions();
            loadShips();
            updateDashboard();
            updateReports();
            alert('Todos los datos han sido eliminados.');
        }
    });
    
    // Botón para restaurar datos de ejemplo
    document.getElementById('restore-examples').addEventListener('click', function() {
        if (confirm('¿Está seguro de que desea restaurar los datos de ejemplo? Esto reemplazará todos los datos actuales.')) {
            transactions = [...exampleTransactions];
            ships = [...exampleShips];
            saveDataToStorage();
            loadTransactions();
            loadShips();
            updateDashboard();
            updateReports();
            alert('Datos de ejemplo restaurados.');
        }
    });
}

function toggleCategoryField() {
    const type = document.getElementById('transaction-type').value;
    const categoryField = document.getElementById('category-field');
    
    if (type === 'expense') {
        categoryField.style.display = 'block';
    } else {
        categoryField.style.display = 'none';
    }
}

function exportData() {
    const data = {
        transactions: transactions,
        ships: ships,
        exportDate: new Date().toISOString(),
        version: '1.0'
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `datos-financieros-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert('Datos exportados correctamente. El archivo se ha descargado.');
}

function importData(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // Validar estructura básica del archivo
            if (!data.transactions || !data.ships) {
                alert('El archivo no tiene la estructura correcta. Debe contener transacciones y barcos.');
                return;
            }
            
            if (confirm('¿Está seguro de que desea importar estos datos? Esto reemplazará todos los datos actuales.')) {
                transactions = data.transactions;
                ships = data.ships;
                saveDataToStorage();
                loadTransactions();
                loadShips();
                updateDashboard();
                updateReports();
                alert('Datos importados correctamente.');
            }
        } catch (error) {
            alert('Error al leer el archivo: ' + error.message);
        }
    };
    
    reader.readAsText(file);
}

function exportToPDF() {
    alert('La funcionalidad de exportación a PDF está en desarrollo. Por ahora, use la exportación de datos en JSON.');
}

function exportToExcel() {
    // Crear contenido CSV para transacciones
    let csvContent = "Fecha,Descripción,Barco,Tipo,Categoría,Monto\n";
    
    transactions.forEach(transaction => {
        const ship = ships.find(s => s.id === transaction.shipId);
        const shipName = ship ? ship.name : 'N/A';
        const type = transaction.type === 'income' ? 'Ingreso' : 'Gasto';
        const category = transaction.category ? getCategoryText(transaction.category) : 'N/A';
        
        csvContent += `"${transaction.date}","${transaction.description}","${shipName}","${type}","${category}",${transaction.amount}\n`;
    });
    
    // Crear blob y descargar
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `transacciones-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert('Datos de transacciones exportados a CSV correctamente.');
}

function loadTransactions() {
    const tbody = document.getElementById('transactions-body');
    tbody.innerHTML = '';
    
    // Ordenar transacciones por fecha (más recientes primero)
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedTransactions.forEach(transaction => {
        const row = document.createElement('tr');
        const ship = ships.find(s => s.id === transaction.shipId);
        const shipName = ship ? ship.name : (transaction.shipId === null ? 'Gastos Generales' : 'Barco no encontrado');
        const badgeClass = transaction.type === 'income' ? 'badge-income' : 'badge-expense';
        const badgeText = transaction.type === 'income' ? 'Ingreso' : 'Gasto';
        const categoryBadge = transaction.category ? `<span class="category-badge">${getCategoryText(transaction.category)}</span>` : '';
        
        row.innerHTML = `
            <td>${formatDate(transaction.date)}</td>
            <td>${transaction.description} ${categoryBadge}</td>
            <td>${shipName}</td>
            <td><span class="badge ${badgeClass}">${badgeText}</span></td>
            <td>$${transaction.amount.toFixed(2)}</td>
            <td>
                <button class="btn edit-transaction-btn" data-id="${transaction.id}" style="padding: 5px 10px; font-size: 0.8rem;">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger delete-transaction-btn" data-id="${transaction.id}" style="padding: 5px 10px; font-size: 0.8rem;">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Actualizar opciones de barcos en el formulario
    updateShipOptions();
    
    // Agregar event listeners a los botones de editar y eliminar
    document.querySelectorAll('.edit-transaction-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            editTransaction(id);
        });
    });
    
    document.querySelectorAll('.delete-transaction-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            deleteTransaction(id);
        });
    });
}

function getCategoryText(category) {
    const categories = {
        'combustible': 'Combustible',
        'mantenimiento': 'Mantenimiento',
        'tripulacion': 'Tripulación',
        'puertos': 'Puertos',
        'seguros': 'Seguros',
        'otros': 'Otros'
    };
    return categories[category] || category;
}

function updateShipOptions() {
    const shipSelect = document.getElementById('transaction-ship');
    shipSelect.innerHTML = '<option value="">Seleccionar barco</option>';
    
    ships.forEach(ship => {
        const option = document.createElement('option');
        option.value = ship.id;
        option.textContent = ship.name;
        shipSelect.appendChild(option);
    });
    
    // Agregar opción para gastos generales
    const generalOption = document.createElement('option');
    generalOption.value = 'general';
    generalOption.textContent = 'Gastos Generales';
    shipSelect.appendChild(generalOption);
}

function loadShips() {
    const container = document.getElementById('ships-container');
    const dashboardContainer = document.getElementById('dashboard-ships');
    
    container.innerHTML = '';
    dashboardContainer.innerHTML = '';
    
    ships.forEach(ship => {
        // Calcular estadísticas del barco
        const shipTransactions = transactions.filter(t => t.shipId === ship.id);
        const income = shipTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expenses = shipTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const balance = income - expenses;
        
        // Crear tarjeta para la sección de barcos
        const shipCard = document.createElement('div');
        shipCard.className = 'ship-card';
        shipCard.innerHTML = `
            <h3>${ship.name}</h3>
            <p><strong>Capacidad:</strong> ${ship.capacity} contenedores</p>
            <p><strong>Año de construcción:</strong> ${ship.year}</p>
            <p><strong>Estado actual:</strong> ${ship.status}</p>
            <p><strong>Último mantenimiento:</strong> ${formatDate(ship.lastMaintenance)}</p>
            <div class="ship-stats">
                <div class="stat">
                    <div class="stat-value">${ship.tripsPerYear}</div>
                    <div class="stat-label">Viajes/año</div>
                </div>
                <div class="stat">
                    <div class="stat-value">${ship.utilization}%</div>
                    <div class="stat-label">Tasa de uso</div>
                </div>
            </div>
            <div style="margin-top: 15px;">
                <button class="btn edit-ship-btn" data-id="${ship.id}" style="margin-right: 10px;">Editar</button>
                <button class="btn btn-danger delete-ship-btn" data-id="${ship.id}">Eliminar</button>
            </div>
        `;
        
        container.appendChild(shipCard);
        
        // Crear tarjeta simplificada para el dashboard
        const dashboardCard = document.createElement('div');
        dashboardCard.className = 'ship-card';
        dashboardCard.innerHTML = `
            <h3>${ship.name}</h3>
            <p>Estado: <strong>${ship.status}</strong></p>
            <p>Último mantenimiento: ${formatDate(ship.lastMaintenance)}</p>
            <div class="ship-stats">
                <div class="stat">
                    <div class="stat-value stat-income">$${income.toFixed(0)}</div>
                    <div class="stat-label">Ingresos</div>
                </div>
                <div class="stat">
                    <div class="stat-value stat-expense">$${expenses.toFixed(0)}</div>
                    <div class="stat-label">Gastos</div>
                </div>
                <div class="stat">
                    <div class="stat-value">$${balance.toFixed(0)}</div>
                    <div class="stat-label">Balance</div>
                </div>
            </div>
        `;
        
        dashboardContainer.appendChild(dashboardCard);
    });
    
    // Agregar event listeners a los botones de editar y eliminar
    document.querySelectorAll('.edit-ship-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            editShip(id);
        });
    });
    
    document.querySelectorAll('.delete-ship-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            deleteShip(id);
        });
    });
}

function updateDashboard() {
    // Calcular totales
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
        
    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
        
    const netBalance = totalIncome - totalExpenses;
    
    // Contar barcos en puerto
    const shipsInPort = ships.filter(s => s.status === 'En puerto').length;
    const activeVoyages = ships.filter(s => s.status === 'En viaje').length;
    
    // Actualizar UI
    document.getElementById('total-income').textContent = `$${totalIncome.toFixed(2)}`;
    document.getElementById('total-expenses').textContent = `$${totalExpenses.toFixed(2)}`;
    document.getElementById('net-balance').textContent = `$${netBalance.toFixed(2)}`;
    document.getElementById('active-voyages').textContent = activeVoyages;
    document.getElementById('ships-in-port').textContent = `${shipsInPort} barcos en puerto`;
}

function updateReports() {
    // Esta función actualizaría los reportes con datos reales
    // Por simplicidad, solo actualizamos la tabla de resumen
    updateShipSummaryTable();
}

function saveTransaction() {
    const type = document.getElementById('transaction-type').value;
    const shipId = document.getElementById('transaction-ship').value;
    const amount = parseFloat(document.getElementById('transaction-amount').value);
    const date = document.getElementById('transaction-date').value;
    const description = document.getElementById('transaction-description').value;
    const category = type === 'expense' ? document.getElementById('transaction-category').value : null;
    
    // Validar que se haya seleccionado un barco válido
    if (shipId === "" || (shipId !== "general" && !ships.find(s => s.id == shipId))) {
        alert('Por favor, seleccione un barco válido');
        return;
    }
    
    // Para gastos generales, no asignamos un barco específico
    const finalShipId = shipId === "general" ? null : parseInt(shipId);
    
    if (editingTransactionId) {
        // Actualizar transacción existente
        const index = transactions.findIndex(t => t.id === editingTransactionId);
        if (index !== -1) {
            transactions[index] = {
                id: editingTransactionId,
                type,
                shipId: finalShipId,
                amount,
                date,
                description,
                category
            };
        }
    } else {
        // Crear nueva transacción
        const newId = transactions.length > 0 ? Math.max(...transactions.map(t => t.id)) + 1 : 1;
        transactions.push({
            id: newId,
            type,
            shipId: finalShipId,
            amount,
            date,
            description,
            category
        });
    }
    
    // Guardar en localStorage
    saveDataToStorage();
    
    // Recargar la tabla y ocultar el formulario
    loadTransactions();
    document.getElementById('transaction-form').style.display = 'none';
    editingTransactionId = null;
    
    // Actualizar dashboard y reportes
    updateDashboard();
    updateReports();
    
    alert('Transacción guardada correctamente');
}

function editTransaction(id) {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
        document.getElementById('transaction-type').value = transaction.type;
        document.getElementById('transaction-ship').value = transaction.shipId || "general";
        document.getElementById('transaction-amount').value = transaction.amount;
        document.getElementById('transaction-date').value = transaction.date;
        document.getElementById('transaction-description').value = transaction.description;
        
        if (transaction.type === 'expense' && transaction.category) {
            document.getElementById('transaction-category').value = transaction.category;
        }
        
        document.getElementById('transaction-form').style.display = 'grid';
        editingTransactionId = id;
        toggleCategoryField();
        document.getElementById('transaction-form').scrollIntoView({ behavior: 'smooth' });
    }
}

function deleteTransaction(id) {
    if (confirm('¿Está seguro de que desea eliminar esta transacción?')) {
        transactions = transactions.filter(t => t.id !== id);
        saveDataToStorage();
        loadTransactions();
        updateDashboard();
        updateReports();
        alert('Transacción eliminada correctamente');
    }
}

function saveShip() {
    const name = document.getElementById('ship-name').value;
    const capacity = parseInt(document.getElementById('ship-capacity').value);
    const year = parseInt(document.getElementById('ship-year').value);
    const status = document.getElementById('ship-status').value;
    const lastMaintenance = document.getElementById('ship-last-maintenance').value;
    
    if (editingShipId) {
        // Actualizar barco existente
        const index = ships.findIndex(s => s.id === editingShipId);
        if (index !== -1) {
            ships[index] = {
                ...ships[index],
                name,
                capacity,
                year,
                status,
                lastMaintenance
            };
        }
    } else {
        // Crear nuevo barco
        const newId = ships.length > 0 ? Math.max(...ships.map(s => s.id)) + 1 : 1;
        ships.push({
            id: newId,
            name,
            capacity,
            year,
            status,
            lastMaintenance,
            tripsPerYear: Math.floor(Math.random() * 5) + 5, // Valor aleatorio para demo
            utilization: Math.floor(Math.random() * 20) + 70 // Valor aleatorio para demo
        });
    }
    
    // Guardar en localStorage
    saveDataToStorage();
    
    // Recargar la lista y ocultar el modal
    loadShips();
    document.getElementById('ship-modal').style.display = 'none';
    editingShipId = null;
    
    // Actualizar opciones de barcos en transacciones
    updateShipOptions();
    
    alert('Barco guardado correctamente');
}

function editShip(id) {
    const ship = ships.find(s => s.id === id);
    if (ship) {
        document.getElementById('ship-modal-title').textContent = 'Editar Barco';
        document.getElementById('ship-name').value = ship.name;
        document.getElementById('ship-capacity').value = ship.capacity;
        document.getElementById('ship-year').value = ship.year;
        document.getElementById('ship-status').value = ship.status;
        document.getElementById('ship-last-maintenance').value = ship.lastMaintenance;
        
        document.getElementById('ship-modal').style.display = 'flex';
        editingShipId = id;
    }
}

function deleteShip(id) {
    if (confirm('¿Está seguro de que desea eliminar este barco? También se eliminarán todas las transacciones asociadas.')) {
        // Eliminar el barco
        ships = ships.filter(s => s.id !== id);
        
        // Eliminar transacciones asociadas al barco
        transactions = transactions.filter(t => t.shipId !== id);
        
        saveDataToStorage();
        loadShips();
        loadTransactions();
        updateDashboard();
        updateReports();
        alert('Barco eliminado correctamente');
    }
}

function updateShipSummaryTable() {
    const tbody = document.getElementById('ship-summary-body');
    tbody.innerHTML = '';
    
    let totalIncome = 0;
    let totalExpenses = 0;
    
    ships.forEach(ship => {
        const shipTransactions = transactions.filter(t => t.shipId === ship.id);
        const income = shipTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expenses = shipTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const balance = income - expenses;
        const profitability = income > 0 ? (balance / income * 100).toFixed(1) : '0.0';
        
        totalIncome += income;
        totalExpenses += expenses;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${ship.name}</td>
            <td>$${income.toFixed(2)}</td>
            <td>$${expenses.toFixed(2)}</td>
            <td>$${balance.toFixed(2)}</td>
            <td>${profitability}%</td>
        `;
        tbody.appendChild(row);
    });
    
    // Agregar fila de totales
    const totalBalance = totalIncome - totalExpenses;
    const totalProfitability = totalIncome > 0 ? (totalBalance / totalIncome * 100).toFixed(1) : '0.0';
    
    const totalRow = document.createElement('tr');
    totalRow.style.fontWeight = 'bold';
    totalRow.style.backgroundColor = '#f8f9fa';
    totalRow.innerHTML = `
        <td>TOTAL</td>
        <td>$${totalIncome.toFixed(2)}</td>
        <td>$${totalExpenses.toFixed(2)}</td>
        <td>$${totalBalance.toFixed(2)}</td>
        <td>${totalProfitability}%</td>
    `;
    tbody.appendChild(totalRow);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

function setupCharts() {
    // --- 1) Preparar datos mensuales reales a partir de las transacciones ---
    const mesesLabels = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const ingresosMensuales = new Array(12).fill(0);
    const gastosMensuales   = new Array(12).fill(0);

    transactions.forEach(t => {
        if (!t.date) return;
        const mes = new Date(t.date).getMonth(); // 0–11
        if (isNaN(mes)) return;
        if (t.type === 'income') {
            ingresosMensuales[mes] += t.amount;
        } else if (t.type === 'expense') {
            gastosMensuales[mes] += t.amount;
        }
    });

    // --- 2) Gráfico línea Resumen (arriba del dashboard) ---
    const financeCanvas = document.getElementById('financeChart');
    if (financeCanvas) {
        const financeCtx = financeCanvas.getContext('2d');
        new Chart(financeCtx, {
            type: 'line',
            data: {
                labels: mesesLabels,
                datasets: [
                    {
                        label: 'Ingresos',
                        data: ingresosMensuales,
                        borderColor: '#2ecc71',
                        backgroundColor: 'rgba(46, 204, 113, 0.1)',
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: 'Gastos',
                        data: gastosMensuales,
                        borderColor: '#e74c3c',
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        tension: 0.3,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Evolución mensual' }
                }
            }
        });
    }

    // --- 3) Gráfico de barras Ingresos vs Gastos (sección Reportes) ---
    const incomeExpenseCanvas = document.getElementById('incomeExpenseChart');
    if (incomeExpenseCanvas) {
        const ctx = incomeExpenseCanvas.getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: mesesLabels,
                datasets: [
                    {
                        label: 'Ingresos',
                        data: ingresosMensuales,
                        backgroundColor: '#2ecc71'
                    },
                    {
                        label: 'Gastos',
                        data: gastosMensuales,
                        backgroundColor: '#e74c3c'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Ingresos vs Gastos por mes' }
                }
            }
        });
    }

    // --- 4) Distribución de gastos por categoría real ---
    const categorias = ['combustible','mantenimiento','tripulacion','puertos','seguros','otros'];
    const gastosPorCategoria = {
        combustible: 0,
        mantenimiento: 0,
        tripulacion: 0,
        puertos: 0,
        seguros: 0,
        otros: 0
    };

    transactions
        .filter(t => t.type === 'expense')
        .forEach(t => {
            const cat = t.category && categorias.includes(t.category) ? t.category : 'otros';
            gastosPorCategoria[cat] += t.amount;
        });

    const expensesCanvas = document.getElementById('expensesChart');
    if (expensesCanvas) {
        const ctx = expensesCanvas.getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Combustible','Mantenimiento','Tripulación','Puertos','Seguros','Otros'],
                datasets: [{
                    data: categorias.map(c => gastosPorCategoria[c]),
                    backgroundColor: [
                        '#3498db',
                        '#2ecc71',
                        '#e74c3c',
                        '#f39c12',
                        '#9b59b6',
                        '#1abc9c'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'right' },
                    title: { display: true, text: 'Distribución real de gastos' }
                }
            }
        });
    }

    // --- 5) Ingresos por barco reales ---
    const incomeByShipCanvas = document.getElementById('incomeByShipChart');
    if (incomeByShipCanvas) {
        const ctx = incomeByShipCanvas.getContext('2d');
        const labelsShips = ships.map(s => s.name);
        const dataShips = ships.map(ship => {
            const shipTransactions = transactions.filter(
                t => t.shipId === ship.id && t.type === 'income'
            );
            return shipTransactions.reduce((sum, t) => sum + t.amount, 0);
        });

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labelsShips,
                datasets: [{
                    label: 'Ingresos ($)',
                    data: dataShips,
                    backgroundColor: [
                        '#3498db',
                        '#2ecc71',
                        '#e74c3c',
                        '#f39c12',
                        '#9b59b6',
                        '#1abc9c'
                    ].slice(0, labelsShips.length)
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'Ingresos por barco (datos reales)' }
                }
            }
        });
    }
}
    
    // Gráfico de distribución de gastos
    const expensesCtx = document.getElementById('expensesChart').getContext('2d');
    const expensesChart = new Chart(expensesCtx, {
        type: 'doughnut',
        data: {
            labels: ['Combustible', 'Mantenimiento', 'Tripulación', 'Puertos', 'Seguros', 'Otros'],
            datasets: [{
                data: [35, 20, 25, 10, 5, 5],
                backgroundColor: [
                    '#3498db',
                    '#2ecc71',
                    '#e74c3c',
                    '#f39c12',
                    '#9b59b6',
                    '#1abc9c'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                },
                title: {
                    display: true,
                    text: 'Distribución de Gastos'
                }
            }
        }
    });
    
    // Gráfico de ingresos por barco
    const incomeByShipCtx = document.getElementById('incomeByShipChart').getContext('2d');
    const incomeByShipChart = new Chart(incomeByShipCtx, {
        type: 'bar',
        data: {
            labels: ships.map(ship => ship.name),
            datasets: [{
                label: 'Ingresos ($)',
                data: ships.map(ship => {
                    const shipTransactions = transactions.filter(t => t.shipId === ship.id && t.type === 'income');
                    return shipTransactions.reduce((sum, t) => sum + t.amount, 0);
                }),
                backgroundColor: [
                    '#3498db',
                    '#2ecc71',
                    '#e74c3c',
                    '#f39c12',
                    '#9b59b6',
                    '#1abc9c'
                ].slice(0, ships.length)
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Ingresos por Barco'
                }
            }
        }
    });
}

// === REGISTRO DEL SERVICE WORKER (PWA) ===
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('./sw.js')
            .catch(err => console.error('Error registrando Service Worker:', err));
    });
}
