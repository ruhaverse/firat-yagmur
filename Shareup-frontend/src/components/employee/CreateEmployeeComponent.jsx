import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import EmployeeService from '../../services/EmployeeService';

function CreateEmployeeComponent() {
    const history = useHistory();
    const { id } = useParams();
    
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [emailId, setEmailId] = useState('');

    useEffect(() => {
        if(id === '_add'){
            return;
        }
        EmployeeService.getEmployeeById(id).then(res => {
            let employee = res.data;
            setFirstName(employee.firstName);
            setLastName(employee.lastName);
            setEmailId(employee.emailId);
        }).catch(err => console.error('Error fetching employee:', err));
    }, [id]);

    const saveOrUpdateEmployee = (e) => {
        e.preventDefault();

        let employee = {firstName, lastName, emailId};

        if(id === '_add'){
            EmployeeService.createEmployee(employee).then(res =>{
                history.push('/employees');
            }).catch(err => console.error('Error creating employee:', err));
        }else{
            EmployeeService.updateEmployee(employee, id).then( res => {
                history.push('/employees');
            }).catch(err => console.error('Error updating employee:', err));
        }
    }

    const cancel = () =>{
        history.push('/employees');
    }

    return (
            <div>
                <br></br>
                   <div className = "container">
                        <div className = "row">
                            <div className = "card col-md-6 offset-md-3 offset-md-3">
                                {
                                    //this.getTitle()
                                }
                                <div className = "card-body">
                                    <form>
                                        <div className = "form-group">
                                            <label> First Name: </label>
                                            <input placeholder="First Name" name="firstName" className="form-control" 
                                                value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                                        </div>
                                        <div className = "form-group">
                                            <label> Last Name: </label>
                                            <input placeholder="Last Name" name="lastName" className="form-control" 
                                                value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                                        </div>
                                        <div className = "form-group">
                                            <label> Email Id: </label>
                                            <input placeholder="Email Address" name="emailId" className="form-control" 
                                                value={emailId} onChange={(e) => setEmailId(e.target.value)}/>
                                        </div>

                                        <button className="btn btn-success" onClick={saveOrUpdateEmployee}>Save</button>
                                        <button className="btn btn-danger" onClick={cancel} style={{marginLeft: "10px"}}>Cancel</button>
                                    </form>
                                </div>
                            </div>
                        </div>

                   </div>
            </div>
        )
}

export default CreateEmployeeComponent;