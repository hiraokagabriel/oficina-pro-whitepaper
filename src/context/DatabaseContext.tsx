import React, { createContext, useContext, useState, useEffect, PropsWithChildren, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import {
  Database,
  WorkOrder,
  LedgerEntry,
  Client,
  Service,
  Part,
  Settings,
  UUID,
} from '../types/index';
import {
  createEmptyDatabase,
  debounce,
  calculateWorkOrderTotal,
} from '../utils/helpers';

// ============================================================================
// CONTEXT TYPES
// ============================================================================

interface DatabaseContextType {
  // Data
  workOrders: WorkOrder[];
  ledger: LedgerEntry[];
  clients: Client[];
  services: Service[];
  parts: Part[];
  settings: Settings;

  // Status
  isLoading: boolean;
  isSyncing: boolean;
  lastError?: Error;
  lastSyncTime?: string;

  // Work Order Methods
  addWorkOrder: (order: WorkOrder) => void;
  updateWorkOrder: (id: UUID, updates: Partial<WorkOrder>) => void;
  deleteWorkOrder: (id: UUID) => void;
  getWorkOrder: (id: UUID) => WorkOrder | undefined;

  // Ledger Methods
  addLedgerEntry: (entry: LedgerEntry) => void;
  updateLedgerEntry: (id: UUID, updates: Partial<LedgerEntry>) => void;
  deleteLedgerEntry: (id: UUID) => void;
  getLedgerEntry: (id: UUID) => LedgerEntry | undefined;

  // Client Methods
  addClient: (client: Client) => void;
  updateClient: (id: UUID, updates: Partial<Client>) => void;
  deleteClient: (id: UUID) => void;
  getClient: (id: UUID) => Client | undefined;
  getAllClients: () => Client[];

  // Service Methods
  addService: (service: Service) => void;
  updateService: (id: UUID, updates: Partial<Service>) => void;
  deleteService: (id: UUID) => void;
  getService: (id: UUID) => Service | undefined;

  // Part Methods
  addPart: (part: Part) => void;
  updatePart: (id: UUID, updates: Partial<Part>) => void;
  deletePart: (id: UUID) => void;
  getPart: (id: UUID) => Part | undefined;

  // Settings Methods
  updateSettings: (updates: Partial<Settings>) => void;

  // Sync Methods
  saveDatabase: () => Promise<void>;
  loadDatabase: () => Promise<void>;
}

// ============================================================================
// CREATE CONTEXT
// ============================================================================

const DatabaseContext = createContext<DatabaseContextType | null>(null);

export function useDatabaseContext() {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabaseContext must be used within DatabaseProvider');
  }
  return context;
}

// ============================================================================
// DATABASE PROVIDER
// ============================================================================

export function DatabaseProvider({ children }: PropsWithChildren) {
  // State
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [settings, setSettings] = useState<Settings>(createEmptyDatabase().settings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastError, setLastError] = useState<Error | undefined>();
  const [lastSyncTime, setLastSyncTime] = useState<string | undefined>();

  // ========================================================================
  // AUTO-SAVE LOGIC
  // ========================================================================

  const saveDatabase = useCallback(async () => {
    try {
      setIsSyncing(true);
      const data = {
        version: '1.0',
        lastModified: new Date().toISOString(),
        workOrders,
        ledger,
        clients,
        services,
        parts,
        settings,
      };

      await invoke('save_database', {
        data: JSON.stringify(data),
      });

      setLastSyncTime(new Date().toISOString());
      setLastError(undefined);
    } catch (error) {
      setLastError(error instanceof Error ? error : new Error(String(error)));
      console.error('Save failed:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [workOrders, ledger, clients, services, parts, settings]);

  const debouncedSave = useCallback(debounce(saveDatabase, 1000), [saveDatabase]);

  // Auto-save on data changes
  useEffect(() => {
    if (!isLoading) {
      debouncedSave();
    }
  }, [workOrders, ledger, clients, services, parts, settings, debouncedSave, isLoading]);

  // ========================================================================
  // LOAD DATABASE
  // ========================================================================

  const loadDatabase = useCallback(async () => {
    try {
      setIsLoading(true);
      const json = (await invoke('load_database')) as string;
      const data: Database = JSON.parse(json);

      setWorkOrders(data.workOrders || []);
      setLedger(data.ledger || []);
      setClients(data.clients || []);
      setServices(data.services || []);
      setParts(data.parts || []);
      setSettings(data.settings || createEmptyDatabase().settings);
      setLastError(undefined);
    } catch (error) {
      console.error('Load failed:', error);
      setLastError(error instanceof Error ? error : new Error(String(error)));
      // Initialize with empty database
      const emptyDb = createEmptyDatabase();
      setWorkOrders(emptyDb.workOrders);
      setLedger(emptyDb.ledger);
      setClients(emptyDb.clients);
      setServices(emptyDb.services);
      setParts(emptyDb.parts);
      setSettings(emptyDb.settings);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load on mount
  useEffect(() => {
    loadDatabase();
  }, [loadDatabase]);

  // ========================================================================
  // WORK ORDER METHODS
  // ========================================================================

  const addWorkOrder = useCallback((order: WorkOrder) => {
    setWorkOrders((prev) => [...prev, order]);
  }, []);

  const updateWorkOrder = useCallback((id: UUID, updates: Partial<WorkOrder>) => {
    setWorkOrders((prev) =>
      prev.map((order) =>
        order.id === id
          ? {
              ...order,
              ...updates,
              totalValue:
                updates.items !== undefined
                  ? calculateWorkOrderTotal(updates.items)
                  : order.totalValue,
            }
          : order
      )
    );
  }, []);

  const deleteWorkOrder = useCallback((id: UUID) => {
    setWorkOrders((prev) => prev.filter((order) => order.id !== id));
  }, []);

  const getWorkOrder = useCallback(
    (id: UUID) => workOrders.find((order) => order.id === id),
    [workOrders]
  );

  // ========================================================================
  // LEDGER METHODS
  // ========================================================================

  const addLedgerEntry = useCallback((entry: LedgerEntry) => {
    setLedger((prev) => [...prev, entry]);
  }, []);

  const updateLedgerEntry = useCallback((id: UUID, updates: Partial<LedgerEntry>) => {
    setLedger((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, ...updates } : entry))
    );
  }, []);

  const deleteLedgerEntry = useCallback((id: UUID) => {
    setLedger((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  const getLedgerEntry = useCallback(
    (id: UUID) => ledger.find((entry) => entry.id === id),
    [ledger]
  );

  // ========================================================================
  // CLIENT METHODS
  // ========================================================================

  const addClient = useCallback((client: Client) => {
    setClients((prev) => [...prev, client]);
  }, []);

  const updateClient = useCallback((id: UUID, updates: Partial<Client>) => {
    setClients((prev) =>
      prev.map((client) => (client.id === id ? { ...client, ...updates } : client))
    );
  }, []);

  const deleteClient = useCallback((id: UUID) => {
    setClients((prev) => prev.filter((client) => client.id !== id));
  }, []);

  const getClient = useCallback(
    (id: UUID) => clients.find((client) => client.id === id),
    [clients]
  );

  const getAllClients = useCallback(() => clients, [clients]);

  // ========================================================================
  // SERVICE METHODS
  // ========================================================================

  const addService = useCallback((service: Service) => {
    setServices((prev) => [...prev, service]);
  }, []);

  const updateService = useCallback((id: UUID, updates: Partial<Service>) => {
    setServices((prev) =>
      prev.map((service) => (service.id === id ? { ...service, ...updates } : service))
    );
  }, []);

  const deleteService = useCallback((id: UUID) => {
    setServices((prev) => prev.filter((service) => service.id !== id));
  }, []);

  const getService = useCallback(
    (id: UUID) => services.find((service) => service.id === id),
    [services]
  );

  // ========================================================================
  // PART METHODS
  // ========================================================================

  const addPart = useCallback((part: Part) => {
    setParts((prev) => [...prev, part]);
  }, []);

  const updatePart = useCallback((id: UUID, updates: Partial<Part>) => {
    setParts((prev) =>
      prev.map((part) => (part.id === id ? { ...part, ...updates } : part))
    );
  }, []);

  const deletePart = useCallback((id: UUID) => {
    setParts((prev) => prev.filter((part) => part.id !== id));
  }, []);

  const getPart = useCallback(
    (id: UUID) => parts.find((part) => part.id === id),
    [parts]
  );

  // ========================================================================
  // SETTINGS METHODS
  // ========================================================================

  const updateSettings = useCallback((updates: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  // ========================================================================
  // CONTEXT VALUE
  // ========================================================================

  const value: DatabaseContextType = {
    // Data
    workOrders,
    ledger,
    clients,
    services,
    parts,
    settings,

    // Status
    isLoading,
    isSyncing,
    lastError,
    lastSyncTime,

    // Methods
    addWorkOrder,
    updateWorkOrder,
    deleteWorkOrder,
    getWorkOrder,
    addLedgerEntry,
    updateLedgerEntry,
    deleteLedgerEntry,
    getLedgerEntry,
    addClient,
    updateClient,
    deleteClient,
    getClient,
    getAllClients,
    addService,
    updateService,
    deleteService,
    getService,
    addPart,
    updatePart,
    deletePart,
    getPart,
    updateSettings,
    saveDatabase,
    loadDatabase,
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
}
