import React, { useState, useEffect } from 'react';
import { useDatabaseContext } from '../context/DatabaseContext';
import { TextInput, Checkbox } from './FormInputs';
import { Settings } from '../types/index';
import '../styles/Settings.css';

export function SettingsTab() {
  const db = useDatabaseContext();
  const [settings, setSettings] = useState<Settings>(db.settings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(db.settings);
  }, [db.settings]);

  const handleSave = () => {
    db.updateSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleExport = () => {
    const data = {
      workOrders: db.workOrders,
      clients: db.clients,
      ledger: db.ledger,
      services: db.services,
      parts: db.parts,
      settings: db.settings,
      exportDate: new Date().toISOString(),
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oficina-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (confirm('Tem certeza? Isso vai substituir todos os dados atuais!')) {
          // Import data
          localStorage.setItem('oficina-database', JSON.stringify(data));
          window.location.reload();
        }
      } catch (error) {
        alert('Erro ao importar arquivo. Verifique se é um backup válido.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    if (
      confirm(
        'ATENÇÃO! Isso vai apagar TODOS os dados permanentemente. Tem certeza?'
      )
    ) {
      if (confirm('Última chance! Realmente quer apagar tudo?')) {
        localStorage.clear();
        window.location.reload();
      }
    }
  };

  return (
    <div className="settings-tab">
      <div className="dashboard-header">
        <h2>⚙️ Configurações</h2>
        <div className="settings-actions">
          <button
            className={`btn-primary ${saved ? 'btn-success' : ''}`}
            onClick={handleSave}
          >
            {saved ? '✓ Salvo!' : 'Salvar Configurações'}
          </button>
        </div>
      </div>

      {/* Dados da Oficina */}
      <section className="settings-section">
        <h3>🏢 Dados da Oficina</h3>
        <div className="settings-grid">
          <TextInput
            label="Nome da Oficina"
            value={settings.officeName}
            onChange={(e) =>
              setSettings({ ...settings, officeName: e.target.value })
            }
            placeholder="Ex: Oficina do João"
          />
          <TextInput
            label="CNPJ"
            value={settings.officeCNPJ || ''}
            onChange={(e) =>
              setSettings({ ...settings, officeCNPJ: e.target.value })
            }
            placeholder="XX.XXX.XXX/XXXX-XX"
          />
          <TextInput
            label="Telefone"
            value={settings.officePhone || ''}
            onChange={(e) =>
              setSettings({ ...settings, officePhone: e.target.value })
            }
            placeholder="(XX) XXXXX-XXXX"
          />
          <div className="form-group-full">
            <TextInput
              label="Endereço"
              value={settings.officeAddress || ''}
              onChange={(e) =>
                setSettings({ ...settings, officeAddress: e.target.value })
              }
              placeholder="Rua, Número, Bairro, Cidade - Estado"
            />
          </div>
        </div>
      </section>

      {/* Preferências */}
      <section className="settings-section">
        <h3>🎨 Preferências</h3>
        <div className="settings-grid">
          <div className="form-field">
            <label className="form-label">Tema</label>
            <select
              className="form-select"
              value={settings.theme}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  theme: e.target.value as 'light' | 'dark',
                })
              }
            >
              <option value="light">Claro</option>
              <option value="dark">Escuro</option>
            </select>
          </div>

          <div className="form-field">
            <label className="form-label">Idioma</label>
            <select
              className="form-select"
              value={settings.language}
              onChange={(e) =>
                setSettings({ ...settings, language: e.target.value })
              }
            >
              <option value="pt-BR">Português (BR)</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>

          <div className="form-field">
            <label className="form-label">Moeda</label>
            <select
              className="form-select"
              value={settings.currency}
              onChange={(e) =>
                setSettings({ ...settings, currency: e.target.value })
              }
            >
              <option value="BRL">Real (R$)</option>
              <option value="USD">Dólar (US$)</option>
              <option value="EUR">Euro (€)</option>
            </select>
          </div>

          <div className="form-field">
            <label className="form-label">Separador Decimal</label>
            <select
              className="form-select"
              value={settings.decimalSeparator}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  decimalSeparator: e.target.value as ',' | '.',
                })
              }
            >
              <option value=",">Vírgula (1.234,56)</option>
              <option value=".">Ponto (1,234.56)</option>
            </select>
          </div>
        </div>

        <div className="settings-checkboxes">
          <Checkbox
            label="Ativar backup automático"
            checked={settings.autoBackupEnabled}
            onChange={(e) =>
              setSettings({
                ...settings,
                autoBackupEnabled: e.target.checked,
              })
            }
          />
        </div>
      </section>

      {/* Backup e Dados */}
      <section className="settings-section">
        <h3>💾 Backup e Dados</h3>
        <div className="backup-actions">
          <div className="backup-card">
            <h4>Exportar Dados</h4>
            <p>Faça backup de todos os dados em arquivo JSON</p>
            <button className="btn-primary" onClick={handleExport}>
              📥 Exportar Backup
            </button>
          </div>

          <div className="backup-card">
            <h4>Importar Dados</h4>
            <p>Restaurar backup de um arquivo JSON</p>
            <label className="btn-secondary" style={{ cursor: 'pointer' }}>
              📤 Importar Backup
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          <div className="backup-card danger">
            <h4>Limpar Todos os Dados</h4>
            <p>⚠️ ATENÇÃO: Esta ação não pode ser desfeita!</p>
            <button className="btn-danger" onClick={handleClearData}>
              🗑️ Apagar Tudo
            </button>
          </div>
        </div>
      </section>

      {/* Informações do Sistema */}
      <section className="settings-section">
        <h3>ℹ️ Informações do Sistema</h3>
        <div className="system-info">
          <div className="info-row">
            <span>Versão:</span>
            <strong>1.0.0</strong>
          </div>
          <div className="info-row">
            <span>Total de O.S.:</span>
            <strong>{db.workOrders.length}</strong>
          </div>
          <div className="info-row">
            <span>Total de Clientes:</span>
            <strong>{db.clients.length}</strong>
          </div>
          <div className="info-row">
            <span>Total de Lançamentos:</span>
            <strong>{db.ledger.length}</strong>
          </div>
          <div className="info-row">
            <span>Última Modificação:</span>
            <strong>{new Date().toLocaleDateString('pt-BR')}</strong>
          </div>
        </div>
      </section>
    </div>
  );
}
