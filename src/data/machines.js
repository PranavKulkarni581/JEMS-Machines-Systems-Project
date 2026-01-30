// machines.js

// Mock Data
export const mockMachines = [
  {
    id: 'M001',
    name: 'CNC Milling Machine',
    client: 'Tata Motors',
    progress: 75,
    currentStage: 'Trials',
    status: 'On Track',
    assignedTo: 'emp1',
    stages: {
      start: { status: 'Completed', date: '2024-01-10', responsible: 'Admin' },
      design: { status: 'Completed', date: '2024-01-15', responsible: 'Design Team' },
      dap: { status: 'Completed', date: '2024-01-20', responsible: 'Engineering' },
      finalDesign: { status: 'Completed', date: '2024-01-25', responsible: 'Design Team' },
      purchase: {
        status: 'Completed',
        date: '2024-02-01',
        responsible: 'Purchase Dept',
        subtasks: [
          { id: 'p1', name: 'Purchase Process', status: 'Completed', assignedTo: 'emp1' },
          { id: 'p2', name: 'Bought Out', status: 'Completed', assignedTo: 'emp2' },
          { id: 'p3', name: 'Special Bought Out', status: 'Completed', assignedTo: 'emp1' },
          { id: 'p4', name: 'Hardware', status: 'Completed', assignedTo: 'emp3' },
          { id: 'p5', name: 'Electrical Bought Out', status: 'Completed', assignedTo: 'emp2' }
        ]
      },
      fabrication: {
        status: 'Completed',
        date: '2024-02-15',
        responsible: 'Fabrication',
        subtasks: [
          { id: 'f1', name: 'Fabrication RM', status: 'Completed', assignedTo: 'emp1', remarks: 'Material quality verified' },
          { id: 'f2', name: 'Electrical Panel', status: 'Completed', assignedTo: 'emp2' },
          { id: 'f3', name: 'Assembly', status: 'Completed', assignedTo: 'emp3' },
          { id: 'f4', name: 'Electro-Mechanical Interfacing', status: 'Completed', assignedTo: 'emp1' }
        ]
      },
      trials: {
        status: 'In Progress',
        date: '2024-02-20',
        responsible: 'QA Team',
        subtasks: [
          { id: 't1', name: 'Initial Testing', status: 'Completed', assignedTo: 'emp2' },
          { id: 't2', name: 'Load Testing', status: 'In Progress', assignedTo: 'emp1' },
          { id: 't3', name: 'Final Trials', status: 'Not Started', assignedTo: 'emp2' }
        ]
      },
      inspection: { status: 'Not Started', responsible: 'QC Team' },
      dispatch: { status: 'Not Started', responsible: 'Logistics' }
    }
  },
  {
    id: 'M002',
    name: 'Hydraulic Press Machine',
    client: 'Mahindra & Mahindra',
    progress: 45,
    currentStage: 'Fabrication',
    status: 'Delayed',
    assignedTo: 'emp2',
    stages: {
      start: { status: 'Completed', date: '2024-01-15', responsible: 'Admin' },
      design: { status: 'Completed', date: '2024-01-22', responsible: 'Design Team' },
      dap: { status: 'Completed', date: '2024-01-28', responsible: 'Engineering' },
      finalDesign: { status: 'Completed', date: '2024-02-05', responsible: 'Design Team' },
      purchase: {
        status: 'Completed',
        date: '2024-02-10',
        responsible: 'Purchase Dept',
        subtasks: [
          { id: 'p1', name: 'Purchase Process', status: 'Completed', assignedTo: 'emp2' },
          { id: 'p2', name: 'Bought Out', status: 'Completed', assignedTo: 'emp1' },
          { id: 'p3', name: 'Special Bought Out', status: 'Completed', assignedTo: 'emp3' },
          { id: 'p4', name: 'Hardware', status: 'Completed', assignedTo: 'emp2' },
          { id: 'p5', name: 'Electrical Bought Out', status: 'Completed', assignedTo: 'emp1' }
        ]
      },
      fabrication: {
        status: 'In Progress',
        date: '2024-02-18',
        responsible: 'Fabrication',
        subtasks: [
          { id: 'f1', name: 'Fabrication RM', status: 'Completed', assignedTo: 'emp2' },
          { id: 'f2', name: 'Electrical Panel', status: 'In Progress', assignedTo: 'emp1', remarks: 'Waiting for components' },
          { id: 'f3', name: 'Assembly', status: 'Not Started', assignedTo: 'emp3' },
          { id: 'f4', name: 'Electro-Mechanical Interfacing', status: 'Not Started', assignedTo: 'emp2' }
        ]
      },
      trials: { status: 'Not Started', responsible: 'QA Team' },
      inspection: { status: 'Not Started', responsible: 'QC Team' },
      dispatch: { status: 'Not Started', responsible: 'Logistics' }
    }
  },
  {
    id: 'M003',
    name: 'Conveyor System',
    client: 'Bajaj Auto',
    progress: 90,
    currentStage: 'Inspection',
    status: 'On Track',
    assignedTo: 'emp3',
    stages: {
      start: { status: 'Completed', date: '2024-01-05', responsible: 'Admin' },
      design: { status: 'Completed', date: '2024-01-10', responsible: 'Design Team' },
      dap: { status: 'Completed', date: '2024-01-12', responsible: 'Engineering' },
      finalDesign: { status: 'Completed', date: '2024-01-18', responsible: 'Design Team' },
      purchase: {
        status: 'Completed',
        date: '2024-01-25',
        responsible: 'Purchase Dept',
        subtasks: [
          { id: 'p1', name: 'Purchase Process', status: 'Completed', assignedTo: 'emp3' },
          { id: 'p2', name: 'Bought Out', status: 'Completed', assignedTo: 'emp1' },
          { id: 'p3', name: 'Special Bought Out', status: 'Completed', assignedTo: 'emp2' },
          { id: 'p4', name: 'Hardware', status: 'Completed', assignedTo: 'emp3' },
          { id: 'p5', name: 'Electrical Bought Out', status: 'Completed', assignedTo: 'emp1' }
        ]
      },
      fabrication: {
        status: 'Completed',
        date: '2024-02-08',
        responsible: 'Fabrication',
        subtasks: [
          { id: 'f1', name: 'Fabrication RM', status: 'Completed', assignedTo: 'emp3' },
          { id: 'f2', name: 'Electrical Panel', status: 'Completed', assignedTo: 'emp1' },
          { id: 'f3', name: 'Assembly', status: 'Completed', assignedTo: 'emp2' },
          { id: 'f4', name: 'Electro-Mechanical Interfacing', status: 'Completed', assignedTo: 'emp3' }
        ]
      },
      trials: {
        status: 'Completed',
        date: '2024-02-12',
        responsible: 'QA Team',
        subtasks: [
          { id: 't1', name: 'Initial Testing', status: 'Completed', assignedTo: 'emp1' },
          { id: 't2', name: 'Load Testing', status: 'Completed', assignedTo: 'emp3' },
          { id: 't3', name: 'Final Trials', status: 'Completed', assignedTo: 'emp2' }
        ]
      },
      inspection: {
        status: 'In Progress',
        date: '2024-02-18',
        responsible: 'QC Team',
        subtasks: [
          { id: 'i1', name: 'Visual Inspection', status: 'Completed', assignedTo: 'emp3' },
          { id: 'i2', name: 'Quality Check', status: 'In Progress', assignedTo: 'emp1' }
        ]
      },
      dispatch: { status: 'Not Started', responsible: 'Logistics' }
    }
  }
];

// Users
export const USERS = {
  'admin': { id: 'admin', name: 'Admin User', role: 'admin', password: 'admin123' },
  'emp1': { id: 'emp1', name: 'Rajesh Kumar', role: 'employee', password: 'emp123' },
  'emp2': { id: 'emp2', name: 'Priya Sharma', role: 'employee', password: 'emp123' },
  'emp3': { id: 'emp3', name: 'Amit Patel', role: 'employee', password: 'emp123' }
};
