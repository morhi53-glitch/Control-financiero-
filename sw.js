const CACHE_NAME = // --- 1) Preparar datos mensuales reales a partir de las transacciones ---
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
}const URLS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});
