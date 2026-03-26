import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';
const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);

// Students
export const getStudents = () => api.get('/students');
export const getStudent = (id) => api.get(`/students/${id}`);
export const getStudentProfile = (id) => api.get(`/students/${id}/profile`);
export const createStudent = (data) => api.post('/students', data);
export const updateStudent = (id, data) => api.put(`/students/${id}`, data);
export const deleteStudent = (id) => api.delete(`/students/${id}`);
export const verifyStudent = (id) => api.put(`/students/${id}/verify`);
export const activateStudent = (data) => api.post('/students/activate', data);

// Organizations
export const getOrganizations = () => api.get('/organizations');
export const getOrganization = (id) => api.get(`/organizations/${id}`);
export const createOrganization = (data) => api.post('/organizations', data);
export const updateOrganization = (id, data) => api.put(`/organizations/${id}`, data);
export const deleteOrganization = (id) => api.delete(`/organizations/${id}`);

// Opportunities (job listings the officer posts, students apply to)
export const getOpportunities = () => api.get('/opportunities');
export const getOpportunity = (id) => api.get(`/opportunities/${id}`);
export const createOpportunity = (data) => api.post('/opportunities', data);
export const updateOpportunity = (id, data) => api.put(`/opportunities/${id}`, data);
export const deleteOpportunity = (id) => api.delete(`/opportunities/${id}`);

// Internships (confirmed internship records, after student is accepted)
export const getInternships = () => api.get('/internships');
export const getInternship = (id) => api.get(`/internships/${id}`);
export const createInternship = (data) => api.post('/internships', data);
export const updateInternship = (id, data) => api.put(`/internships/${id}`, data);
export const deleteInternship = (id) => api.delete(`/internships/${id}`);

// Applications
export const getApplications = () => api.get('/applications');            // staff
export const getMyApplications = () => api.get('/applications/my');       // student
export const getApplication = (id) => api.get(`/applications/${id}`);
export const createApplication = (data) => api.post('/applications', data);
export const deleteApplication = (id) => api.delete(`/applications/${id}`);
export const addRoundToApplication = (id, data) => api.post(`/applications/${id}/round`, data);
export const markApplicationSelected = (id) => api.put(`/applications/${id}/select`);

// Rounds
export const updateRound = (roundId, data) => api.put(`/rounds/${roundId}`, data);

// Placements
export const getPlacements = () => api.get('/placements');
export const createPlacement = (data) => api.post('/placements', data);

// Reports / Dashboard
export const getDashboard = (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  return api.get(`/reports/dashboard${params ? '?' + params : ''}`);
};

// Staff Registration
export const registerOfficer = (data) => api.post('/auth/register/officer', data);
export const registerFaculty = (data) => api.post('/auth/register/faculty', data);
export const listFacultyAccounts = () => api.get('/auth/faculty');
export const listOfficerAccounts = () => api.get('/auth/officers');

// Profiles
export const getFacultyProfile = () => api.get('/auth/profile/faculty');
export const updateFacultyProfile = (data) => api.put('/auth/profile/faculty', data);
export const getOfficerProfile = () => api.get('/auth/profile/officer');
export const updateOfficerProfile = (data) => api.put('/auth/profile/officer', data);

export default api;
