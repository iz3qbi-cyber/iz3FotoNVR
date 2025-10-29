# iz3FotoNVR

**Sistema completo di monitoraggio fotovoltaico Huawei SUN2000-10KTL-M1 con analisi pannello per pannello e DVR ONVIF multi-telecamera per Raspberry Pi**

![iz3FotoNVR Logo](https://img.shields.io/badge/iz3FotoNVR-v2.0.0-blue.svg) ![Platform](https://img.shields.io/badge/platform-Raspberry%20Pi-green.svg) ![Node.js](https://img.shields.io/badge/node.js-v14+-brightgreen.svg) ![License](https://img.shields.io/badge/license-MIT-orange.svg)

---

## 🌟 **Caratteristiche Principali**

### ⚡ **Monitoraggio Fotovoltaico Avanzato**
- **Inverter Huawei SUN2000-10KTL-M1**: Monitoraggio completo via Modbus TCP
- **Analisi Panel-Level**: Visualizzazione dettagliata di ogni singolo pannello/optimizer
- **Statistiche Energetiche**: Dati giornalieri, mensili e annuali in tempo reale
- **Dashboard Interattivo**: Vista griglia e tabella intercambiabili
- **Auto-refresh**: Aggiornamento automatico ogni 30 secondi

### 💰 **Calcolo Costi Automatico**
- **Tariffe Octopus Italia**: Integrazione completa e configurabile
- **Risparmio Energetico**: Calcolo automatico del risparmio in tempo reale
- **Ricavi Vendita**: Stima ricavi da immissione in rete
- **Proiezioni Economiche**: Analisi giornaliere, mensili e annuali

### 📹 **DVR Multi-Telecamera ONVIF**
- **Supporto 6-8 Telecamere**: Configurazione individuale per ogni dispositivo
- **Credenziali Separate**: IP, porta, username e password per ogni telecamera
- **Visualizzazione Simultanea**: Griglia di video in tempo reale
- **Controllo Remoto**: Accesso via interfaccia web responsive
- **Schermo Intero**: Modalità fullscreen per monitoraggio dedicato

### 🔧 **Configurazione Semplice**
- **Interface Web Intuitiva**: Configurazione guidata step-by-step
- **Design Responsive**: Ottimizzato per desktop, tablet e mobile
- **Real-time Status**: Indicatori di stato per tutti i dispositivi
- **Backup Configurazione**: Salvataggio automatico delle impostazioni

---

## 🚀 **Installazione Rapida**

### **Prerequisiti**
- Raspberry Pi 4 con Raspberry Pi OS
- Node.js 14+ installato
- Connessione di rete all'inverter Huawei e alle telecamere ONVIF

### **Installazione**

```bash
# 1. Clona il repository
git clone https://github.com/iz3qbi-cyber/iz3FotoNVR.git
cd iz3FotoNVR

# 2. Installa le dipendenze
npm install

# 3. Avvia il server
npm start
```

### **Accesso all'interfaccia**
Dopo l'avvio del server:
```
http://[IP_RASPBERRY_PI]:3000
```

---

## 🔌 **Specifiche Tecniche**

### **Inverter Supportato**
- **Modello**: Huawei SUN2000-10KTL-M1
- **Protocollo**: Modbus TCP (porta 502)
- **Registri Monitorati**:
  - `32000-32049`: Stato inverter e dati base
  - `32064-32083`: Potenze AC/DC
  - `32106-32115`: Energie cumulative
  - `37000+`: Dati optimizer panel-level

### **Telecamere ONVIF**
- **Quantità**: Fino a 8 telecamere simultanee
- **Protocolli**: RTSP, MJPEG, HTTP
- **Risoluzione**: Supporto full HD
- **Autenticazione**: Username/password individuali

### **Tariffe Octopus Italia**
- **Tariffa base**: €0.25/kWh (configurabile)
- **Ore punta**: €0.35/kWh
- **Ore fuori punta**: €0.18/kWh
- **Quota fissa**: €0.45/giorno
- **Vendita rete**: €0.08/kWh

---

## ⚙️ **Gestione del Servizio**

### **Avvio Manuale**
```bash
node server.js
```

### **PM2 (Consigliato)**
```bash
# Installa PM2
npm install -g pm2

# Avvia il servizio
npm run pm2-start

# Altri comandi utili
npm run pm2-stop     # Ferma il servizio
npm run pm2-restart  # Riavvia il servizio
npm run pm2-logs     # Visualizza i log

# Autostart all'avvio del sistema
pm2 startup
pm2 save
```

---

## 🛠️ **Troubleshooting**

### **Errori Comuni**

**1. Errore connessione Modbus**
- Verifica IP inverter (default: 192.168.1.20)
- Controlla porta Modbus TCP (default: 502)
- Assicurati che Modbus sia abilitato sull'inverter

**2. Telecamere non rilevate**
- Verifica che le telecamere siano sulla stessa rete
- Controlla credenziali di accesso (username/password)
- Verifica supporto ONVIF sulla telecamera

**3. Pannelli non visualizzati**
- Verifica configurazione optimizer
- Controlla registri Modbus nel range 37000+
- Assicurati che l'inverter supporti monitoraggio panel-level

---

## 👥 **Contributi e Supporto**

### **Segnalazione Bug**
Per segnalare bug o richiedere funzionalità:
- Apri una [Issue su GitHub](https://github.com/iz3qbi-cyber/iz3FotoNVR/issues)
- Includi dettagli su sistema operativo, versione Node.js e log di errore

### **Contatti**
- **Sviluppatore**: Giulio Zen (IZ3QBI)
- **Email**: iz3qbi@gmail.com
- **GitHub**: [@iz3qbi-cyber](https://github.com/iz3qbi-cyber)

---

## 📜 **Licenza**

Questo progetto è rilasciato sotto licenza **MIT**.

---

## 🔍 **Changelog**

### **v2.0.0** (Ottobre 2025)
- ✨ **Nuovo**: Analisi pannello per pannello con optimizer
- ✨ **Nuovo**: Calcolo automatico costi Octopus Italia
- ✨ **Nuovo**: Supporto multi-telecamera ONVIF (6-8 dispositivi)
- ✨ **Nuovo**: Dashboard responsive con gradiente moderno
- ✨ **Nuovo**: Vista griglia e tabella per pannelli
- ✨ **Nuovo**: Auto-refresh automatico
- 🔧 **Migliorato**: Interfaccia utente completamente ridisegnata
- 🔧 **Migliorato**: Gestione errori e indicatori di stato
- 🔧 **Migliorato**: Compatibilità mobile e responsive design

---

**⭐ Se ti piace iz3FotoNVR, metti una stella su GitHub!**

[![GitHub stars](https://img.shields.io/github/stars/iz3qbi-cyber/iz3FotoNVR.svg?style=social&label=Star)](https://github.com/iz3qbi-cyber/iz3FotoNVR/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/iz3qbi-cyber/iz3FotoNVR.svg)](https://github.com/iz3qbi-cyber/iz3FotoNVR/issues)

---

**iz3FotoNVR v2.0.0** | **Ultima modifica**: Ottobre 2025 | **Compatibilità**: Raspberry Pi 4, Node.js 14+