import axios from 'axios';
import AuthService from './auth.services';
import settings from "./Settings";
import logger from '../utils/logger';

const EMPLOYEE_API_BASE_URL = `${settings.apiUrl}`;
let authAxios = null;

const authenticate = () => {
    if (AuthService.getCurrentUser()) {
        authAxios = axios.create({
            baseURL: `${EMPLOYEE_API_BASE_URL}/api/v1/employees`,
            headers: {
                Authorization: `Bearer ${AuthService.getCurrentUser().jwt}`
            }
        });
    } else {
        authAxios = axios.create({
            baseURL: `${EMPLOYEE_API_BASE_URL}/api/v1/`
        });
    }
};
authenticate();

class EmployeeService {
    getEmployees = async () => {
        try {
            authenticate();
            const result = await authAxios.get('/');
            return result;
        } catch (error) {
            logger.error('EmployeeService.getEmployees failed:', error);
            throw error;
        }
    }

    createEmployee = async (employee) => {
        try {
            const result = await authAxios.post('/', employee)
            return result;
        } catch (error) {
            logger.error('EmployeeService.createEmployee failed:', error);
            throw error;
        }
    }

    getEmployeeById = async (employeeId) => {
        try {
            const result = await authAxios.get('/'+ employeeId)
            return result;
        } catch (error) {
            logger.error('EmployeeService.getEmployeeById failed:', error);
            throw error;
        }
    }

    updateEmployee = async (employee, employeeId) => {
        try {
            const result = await authAxios.put(employeeId, employee)
            return result;
        } catch (error) {
            logger.error('EmployeeService.updateEmployee failed:', error);
            throw error;
        }
    }

    deleteEmployee = async (employeeId) => {
        try {
            const result = await authAxios.delete('/'+ employeeId)
            return result;
        } catch (error) {
            logger.error('EmployeeService.deleteEmployee failed:', error);
            throw error;
        }
    }
}

export default new EmployeeService();