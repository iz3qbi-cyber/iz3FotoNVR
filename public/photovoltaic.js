let currentView = 'grid';
let panelData = null;
let inverterData = null;
let energyStats = null;

// Carica tutti i dati fotovoltaici
async function loadPhotovoltaicData() {
    await Promise.all([
        loadInverterData(),
        loadEnergyStats(),
        loadPanelData()
    ]);
}

// Carica dati generali inverter
async function loadInverterData() {
    try {
        const response = await fetch('/api/huawei-data');
        if (response.ok) {
            inverterData = await response.json();
            displayInverterData();
        } else {
            document.getElementById('inverterData').innerHTML = 
                '<h2>Stato Generale Inverter</h2><div class="error">❌ Errore caricamento dati inverter</div>';
        }
    } catch (error) {
        console.error('Errore caricamento inverter:', error);
        document.getElementById('inverterData').innerHTML = 
            '<h2>Stato Generale Inverter</h2><div class="error">❌ Errore comunicazione server</div>';
    }
}

// Carica statistiche energetiche e costi
async function loadEnergyStats() {
    try {
        const response = await fetch('/api/energy-stats');
        if (response.ok) {
            energyStats = await response.json();
            displayEnergyStats();
        } else {
            document.getElementById('energyStats').innerHTML = 
                '<h2>Statistiche Energetiche</h2><div class="error">❌ Errore caricamento statistiche</div>';
        }
    } catch (error) {
        console.error('Errore caricamento statistiche:', error);
        document.getElementById('energyStats').innerHTML = 
            '<h2>Statistiche Energetiche</h2><div class="error">❌ Errore comunicazione server</div>';
    }
}

// Carica dati pannelli
async function loadPanelData() {
    try {
        const response = await fetch('/api/panels');
        if (response.ok) {
            panelData = await response.json();
            displayPanels();
        } else {
            document.getElementById('panelGridContainer').innerHTML = 
                '<div class="error">❌ Errore caricamento dati pannelli</div>';
            document.getElementById('panelTableContainer').innerHTML = 
                '<div class="error">❌ Errore caricamento dati pannelli</div>';
        }
    } catch (error) {
        console.error('Errore caricamento pannelli:', error);
        document.getElementById('panelGridContainer').innerHTML = 
            '<div class="error">❌ Errore comunicazione server</div>';
        document.getElementById('panelTableContainer').innerHTML = 
            '<div class="error">❌ Errore comunicazione server</div>';
    }
}

// Visualizza dati inverter
function displayInverterData() {
    if (!inverterData) return;
    
    const statusText = inverterData.status === 1 ? '🟢 Operativo' : '🔴 Fermo';
    const statusClass = inverterData.status === 1 ? 'status-ok' : 'status-error';
    
    document.getElementById('inverterData').innerHTML = `
        <h2>Stato Generale Inverter SUN2000-10KTL-M1</h2>
        <div class="inverter-grid">
            <div class="data-card">
                <h3>Stato Sistema</h3>
                <div class="value ${statusClass}">${statusText}</div>
            </div>
            <div class="data-card">
                <h3>⚡ Potenza Ingresso</h3>
                <div class="value">${inverterData.inputPower.toFixed(2)} kW</div>
            </div>
            <div class="data-card">
                <h3>🏠 Potenza Uscita</h3>
                <div class="value">${inverterData.outputPower.toFixed(2)} kW</div>
            </div>
            <div class="data-card">
                <h3>🔌 Tensione AC</h3>
                <div class="value">${inverterData.acVoltageA.toFixed(1)} V</div>
            </div>
            <div class="data-card">
                <h3>⚡ Corrente AC</h3>
                <div class="value">${inverterData.acCurrentA.toFixed(2)} A</div>
            </div>
            <div class="data-card">
                <h3>🌡️ Temperatura</h3>
                <div class="value">${inverterData.temperature.toFixed(1)} °C</div>
            </div>
            <div class="data-card">
                <h3>📅 Energia Oggi</h3>
                <div class="value">${inverterData.dailyEnergy.toFixed(2)} kWh</div>
            </div>
            <div class="data-card">
                <h3>📊 Energia Totale</h3>
                <div class="value">${inverterData.totalEnergy.toFixed(0)} kWh</div>
            </div>
        </div>
        <div class="string-data">
            <h3>Stringhe DC</h3>
            <div class="string-grid">
                <div class="string-card">
                    <h4>⚡ Stringa 1</h4>
                    <p>Tensione: ${inverterData.dcVoltage1.toFixed(1)} V</p>
                    <p>Corrente: ${inverterData.dcCurrent1.toFixed(2)} A</p>
                    <p>Potenza: ${(inverterData.dcVoltage1 * inverterData.dcCurrent1 / 1000).toFixed(2)} kW</p>
                </div>
                <div class="string-card">
                    <h4>⚡ Stringa 2</h4>
                    <p>Tensione: ${inverterData.dcVoltage2.toFixed(1)} V</p>
                    <p>Corrente: ${inverterData.dcCurrent2.toFixed(2)} A</p>
                    <p>Potenza: ${(inverterData.dcVoltage2 * inverterData.dcCurrent2 / 1000).toFixed(2)} kW</p>
                </div>
            </div>
        </div>
        <div class="timestamp">⏰ Ultimo aggiornamento: ${new Date(inverterData.timestamp).toLocaleString('it-IT')}</div>
    `;
}

// Visualizza statistiche energetiche
function displayEnergyStats() {
    if (!energyStats) return;
    
    document.getElementById('energyStats').innerHTML = `
        <h2>Statistiche Energetiche e Costi (Octopus Italia)</h2>
        <div class="stats-grid">
            <div class="stats-section">
                <h3>📊 Produzione Energia</h3>
                <div class="stats-cards">
                    <div class="stat-card">
                        <h4>Oggi</h4>
                        <div class="value">${energyStats.production.today.toFixed(2)} kWh</div>
                    </div>
                    <div class="stat-card">
                        <h4>Questo Mese</h4>
                        <div class="value">${energyStats.production.thisMonth.toFixed(0)} kWh</div>
                    </div>
                    <div class="stat-card">
                        <h4>Quest'Anno</h4>
                        <div class="value">${energyStats.production.thisYear.toFixed(0)} kWh</div>
                    </div>
                    <div class="stat-card">
                        <h4>Totale</h4>
                        <div class="value">${energyStats.production.total.toFixed(0)} kWh</div>
                    </div>
                </div>
            </div>
            
            <div class="stats-section">
                <h3>💰 Benefici Economici</h3>
                <div class="stats-cards">
                    <div class="stat-card economics">
                        <h4>Oggi</h4>
                        <div class="value">€ ${energyStats.economics.daily.totalBenefit.toFixed(2)}</div>
                        <div class="breakdown">
                            <span>Risparmio: € ${energyStats.economics.daily.savings.toFixed(2)}</span>
                            <span>Vendita rete: € ${energyStats.economics.daily.exportRevenue.toFixed(2)}</span>
                        </div>
                    </div>
                    <div class="stat-card economics">
                        <h4>Questo Mese</h4>
                        <div class="value">€ ${energyStats.economics.monthly.totalBenefit.toFixed(0)}</div>
                        <div class="breakdown">
                            <span>Risparmio: € ${energyStats.economics.monthly.savings.toFixed(0)}</span>
                            <span>Vendita rete: € ${energyStats.economics.monthly.exportRevenue.toFixed(0)}</span>
                        </div>
                    </div>
                    <div class="stat-card economics">
                        <h4>Quest'Anno</h4>
                        <div class="value">€ ${energyStats.economics.yearly.totalBenefit.toFixed(0)}</div>
                        <div class="breakdown">
                            <span>Risparmio: € ${energyStats.economics.yearly.savings.toFixed(0)}</span>
                            <span>Vendita rete: € ${energyStats.economics.yearly.exportRevenue.toFixed(0)}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="stats-section">
                <h3>⚡ Tariffe Octopus Italia</h3>
                <div class="tariff-info">
                    <p>🏠 Tariffa base: € ${energyStats.tariffs.energyRate}/kWh</p>
                    <p>⬆️ Ore punta: € ${energyStats.tariffs.peakRate}/kWh</p>
                    <p>⬇️ Ore fuori punta: € ${energyStats.tariffs.offPeakRate}/kWh</p>
                    <p>📅 Quota fissa giornaliera: € ${energyStats.tariffs.standingCharge}</p>
                    <p>💸 Tariffa vendita rete: € 0.08/kWh</p>
                </div>
            </div>
        </div>
        <div class="timestamp">⏰ Ultimo aggiornamento: ${new Date(energyStats.timestamp).toLocaleString('it-IT')}</div>
    `;
}

// Visualizza pannelli in base alla vista selezionata
function displayPanels() {
    if (!panelData || !panelData.panels) return;
    
    if (currentView === 'grid') {
        displayPanelGrid();
    } else {
        displayPanelTable();
    }
}

// Visualizza pannelli come griglia
function displayPanelGrid() {
    if (!panelData || !panelData.panels.length) {
        document.getElementById('panelGridContainer').innerHTML = 
            '<div class="no-data">🔌 Nessun pannello rilevato o inverter disconnesso</div>';
        return;
    }
    
    const panelsHtml = panelData.panels.map(panel => {
        const statusClass = panel.status === 'OK' ? 'panel-ok' : 'panel-warning';
        const efficiency = panel.power > 0 ? ((panel.power / 400) * 100).toFixed(0) : 0; // Assumendo pannelli da 400W
        const statusIcon = panel.status === 'OK' ? '🟢' : '🟡';
        
        return `
            <div class="panel-card ${statusClass}">
                <div class="panel-header">
                    <h4>⚡ ${panel.id}</h4>
                    <span class="panel-status">${statusIcon} ${panel.status}</span>
                </div>
                <div class="panel-data">
                    <div class="panel-metric">
                        <span class="metric-label">🔋 Potenza</span>
                        <span class="metric-value">${panel.power.toFixed(1)} W</span>
                    </div>
                    <div class="panel-metric">
                        <span class="metric-label">⚡ Tensione</span>
                        <span class="metric-value">${panel.voltage.toFixed(1)} V</span>
                    </div>
                    <div class="panel-metric">
                        <span class="metric-label">🔌 Corrente</span>
                        <span class="metric-value">${panel.current.toFixed(2)} A</span>
                    </div>
                    <div class="panel-metric">
                        <span class="metric-label">🌡️ Temperatura</span>
                        <span class="metric-value">${panel.temperature.toFixed(1)} °C</span>
                    </div>
                    <div class="panel-metric">
                        <span class="metric-label">📅 Energia oggi</span>
                        <span class="metric-value">${panel.energy.toFixed(2)} kWh</span>
                    </div>
                    <div class="efficiency-bar">
                        <div class="efficiency-fill" style="width: ${efficiency}%"></div>
                        <span class="efficiency-text">${efficiency}%</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    document.getElementById('panelGridContainer').innerHTML = `
        <div class="panels-summary">
            <p>🔌 Pannelli attivi: ${panelData.panels.length} configurati</p>
            <p>⚡ Potenza totale pannelli: ${panelData.panels.reduce((sum, p) => sum + p.power, 0).toFixed(1)} W</p>
        </div>
        <div class="panels-grid-layout">
            ${panelsHtml}
        </div>
        <div class="timestamp">⏰ Ultimo aggiornamento: ${new Date(panelData.timestamp).toLocaleString('it-IT')}</div>
    `;
}

// Visualizza pannelli come tabella
function displayPanelTable() {
    if (!panelData || !panelData.panels.length) {
        document.getElementById('panelTableContainer').innerHTML = 
            '<div class="no-data">🔌 Nessun pannello rilevato o inverter disconnesso</div>';
        return;
    }
    
    const rowsHtml = panelData.panels.map(panel => {
        const statusClass = panel.status === 'OK' ? 'status-ok' : 'status-warning';
        const statusIcon = panel.status === 'OK' ? '🟢' : '🟡';
        return `
            <tr>
                <td>⚡ ${panel.id}</td>
                <td>S${panel.string}</td>
                <td>${panel.position}</td>
                <td>${panel.power.toFixed(1)} W</td>
                <td>${panel.voltage.toFixed(1)} V</td>
                <td>${panel.current.toFixed(2)} A</td>
                <td>${panel.temperature.toFixed(1)} °C</td>
                <td>${panel.energy.toFixed(2)} kWh</td>
                <td><span class="${statusClass}">${statusIcon} ${panel.status}</span></td>
            </tr>
        `;
    }).join('');
    
    document.getElementById('panelTableContainer').innerHTML = `
        <div class="panels-summary">
            <p>🔌 Pannelli attivi: ${panelData.panels.length} configurati</p>
            <p>⚡ Potenza totale pannelli: ${panelData.panels.reduce((sum, p) => sum + p.power, 0).toFixed(1)} W</p>
        </div>
        <table class="panels-table">
            <thead>
                <tr>
                    <th>ID Pannello</th>
                    <th>Stringa</th>
                    <th>Posizione</th>
                    <th>Potenza (W)</th>
                    <th>Tensione (V)</th>
                    <th>Corrente (A)</th>
                    <th>Temperatura (°C)</th>
                    <th>Energia oggi (kWh)</th>
                    <th>Stato</th>
                </tr>
            </thead>
            <tbody>
                ${rowsHtml}
            </tbody>
        </table>
        <div class="timestamp">⏰ Ultimo aggiornamento: ${new Date(panelData.timestamp).toLocaleString('it-IT')}</div>
    `;
}

// Cambia vista pannelli
function showPanelView(view) {
    currentView = view;
    
    // Aggiorna bottoni
    document.getElementById('gridViewBtn').classList.toggle('active', view === 'grid');
    document.getElementById('tableViewBtn').classList.toggle('active', view === 'table');
    
    // Mostra/nascondi sezioni
    document.getElementById('panelsGrid').style.display = view === 'grid' ? 'block' : 'none';
    document.getElementById('panelsTable').style.display = view === 'table' ? 'block' : 'none';
    
    // Aggiorna visualizzazione
    displayPanels();
}

// Auto-refresh ogni 30 secondi
setInterval(() => {
    loadPhotovoltaicData();
}, 30000);