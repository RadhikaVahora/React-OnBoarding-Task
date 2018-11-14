import React, { Component } from 'react';
import { Button, Header, Icon, Modal, Table, Form, Menu, TableRow, TableCell } from 'semantic-ui-react';
import axios from 'axios';
//import { Button,Modal } from 'semantic-ui-react';

class Customerrecord extends React.Component {
    constructor() {
        super();

        this.state = {
           modalOpen: false,
            items: [],
            CustomerName: '',
            Address: '',
            edit: false,
            dlt:false

        };
        this.editModal = this.editModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.logChange = this.logChange.bind(this); // We capture the value and change state as user changes the value here.
        this.handleEdit = this.handleEdit.bind(this); // Function where we submit data
        this.deleteModal = this.deleteModal.bind(this);

    }
    editModal(cus) {
        this.setState({
            edit: true,
            CustomerName: cus.CustomerName,
            Address: cus.Address,
            CustomerId: cus.CustomerId
        }, () => console.log(this.state.CustomerId));
       
    }
    deleteModal(cus) {
        this.setState({
            dlt: true,
            CustomerName: cus.CustomerName,
            Address: cus.Address,
            CustomerId: cus.CustomerId
        }, () => console.log(this.state.CustomerId));

    }

    closeModal() {
        this.setState({
            modalOpen: false,
            edit: false,
            dlt: false
        });
    }

    logChange(e) {
        this.setState({
            [e.target.name]: e.target.value //setting value edited by the admin in state.
        });

    }

    componentDidMount() {
        $.get("/Customer/GetCustomers", function (data) {
            this.setState({
                items: data
            });
        }.bind(this));
    }

    componentDidUpdate() {
        $.get("/Customer/GetCustomers", function (data) {
            this.setState({
                items: data
            });
        }.bind(this));

    }

    handleDelete = () => {
        const Cusdata = this.state.CustomerId;
        console.log(Cusdata);
        //if (!confirm("Do you want to delete Customer?"))
        //    return;
        //else {
            axios.delete('/Customer/DeleteCustomer', { data: { id: Cusdata } });
        //}
        this.closeModal();
    }

    handleEdit(event) {
        //Edit functionality
        event.preventDefault();
        var Cusdata = {
            CustomerName: this.state.CustomerName,
            Address: this.state.Address,
            CustomerId: this.state.CustomerId
        };
        console.log(Cusdata);
        axios({
            method: 'put',
            url: '/Customer/EditCustomer',
            data: Cusdata
        }).then(function () {
            //handleClose();

            // this.state.modalOpen = false;
            console.log("Added");
        });
        this.closeModal();
    }


    render() {
       
        return (
            <div>
                <Table celled striped selectable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Customer Name</Table.HeaderCell>
                            <Table.HeaderCell>Address</Table.HeaderCell>
                            <Table.HeaderCell>Edit</Table.HeaderCell>
                            <Table.HeaderCell>Delete</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.state.items.map(member =>
                            <TableRow key={member.CustomerId}>
                                <TableCell>{member.CustomerName} </TableCell>
                                <TableCell>{member.Address}</TableCell>
                                <TableCell><Button id="edtbtn" color="orange" onClick={this.editModal.bind(this, member)}><Icon name='edit' />Edit</Button></TableCell>
                                <TableCell><Button id="dltbtn" color="red" onClick={this.deleteModal.bind(this,member)} ><Icon name='trash' />Delete</Button></TableCell>
                                    
                            </TableRow>
                        )}
                        
                    </Table.Body>
                </Table>
                <Modal size='small' open={this.state.edit} onClose={this.closeModal}>
                    <Modal.Header>Edit Customer</Modal.Header>
                    <Modal.Content>
                        <Form>
                            <Form.Field>
                                <label>Customer Name</label>
                                <input name='CustomerName' placeholder='Name' onChange={this.logChange} value={this.state.CustomerName} />
                            </Form.Field>
                            <Form.Field>
                                <label>Address</label>
                                <input name='Address' placeholder='Address' onChange={this.logChange} value={this.state.Address} />
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={this.handleEdit}>Edit</Button>
                        <Button onClick={this.closeModal}>Close</Button>
                    </Modal.Actions>
                </Modal>

                <Modal size='small' open={this.state.dlt} onClose={this.closeModal}>
                    <Modal.Header>Delete Customer</Modal.Header>
                    <Modal.Content>
                        <p>Are you sure you want to Delete this Customer??</p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={this.handleDelete}>Delete</Button>
                        <Button onClick={this.closeModal}>Close</Button>
                    </Modal.Actions>
                </Modal>
            </div>
        );
    }
}

function validate(CustomerName, Address) {

    return {
        CustomerName: CustomerName.length === 0,
        Address: Address.length === 0,
    };
    // true means invalid, so our conditions got reversed
    
}
class AddCustomer extends React.Component {
    constructor() {
        super();
        this.state = {
            modalOpen: false,
            CustomerName: '',
            Address: '',
            touched: { NameValid: false, AddValid: false },
            nameerrmsg: "",
            adderrmsg: ""

        };
    }
   
    handleNameChange = (e) => {
        this.setState({CustomerName: e.target.value})
    }
    handleAddChange = (e) => {
        this.setState({ Address: e.target.value })
    }

    canBeSubmitted() {
        const errors = validate(this.state.CustomerName, this.state.Address);
        const isDisabled = Object.keys(errors).some(x => errors[x]);
        console.log(errors);
       return !isDisabled;
    }

    handleSubmit = (evt) => {
        if (!this.canBeSubmitted()) {
            evt.preventDefault();
            this.setState({
                nameerrmsg: "Please Enter Name",
                adderrmsg: "Please Enter Address"
            });
            return;
        } else {
            this.setState({
                nameerrmsg: "",
                adderrmsg:""
            });
        }
       
        var Cusdata = {
            CustomerName: this.state.CustomerName,
            Address: this.state.Address
        };
       
        axios({
            method: 'post',
            url: '/Customer/AddCustomer',
            data: Cusdata
        }).then(function () {
            console.log("Added");
            });
        this.handleClose();
     }
        
    handleOpen = () => this.setState({ modalOpen: true })

    handleClose = () => {
        this.state.touched.NameValid = false;
        this.state.touched.AddValid = false;
        this.state.CustomerName = "";
        this.state.Address = "";
        this.setState({ modalOpen: false });
    }

    handleBlur = (field) => (evt) => {
        this.setState({
            touched: { ...this.state.touched, [field]: true },
        },() => { console.log(this.state.touched); });
    }
   
    render() {
        const { modalOpen } = this.state;
        const errors = validate(this.state.CustomerName, this.state.Address);
        const isDisabled = Object.keys(errors).some(x => errors[x]);

        return (
            <div>
                <Button primary onClick={this.handleOpen}>Add Customer</Button>

                <Modal size='small' open={modalOpen} onClose={this.handleClose}>
                    <Modal.Header>Add Customer</Modal.Header>
                    <Modal.Content>
                        <Form>
                            <Form.Field>
                                <label>Customer Name</label>
                                <input className={errors.CustomerName} placeholder='Name' onChange={this.handleNameChange}
                                    onBlur={this.handleBlur('NameValid')} />
                                <span style={{ color: "red" }}>{this.state.nameerrmsg}</span>
                            </Form.Field>
                            <Form.Field>
                                <label>Address</label>
                                <input className={errors.Address} placeholder='Address' onChange={this.handleAddChange}
                                    onBlur={this.handleBlur('AddValid')} />
                                <span style={{ color: "red" }}>{this.state.adderrmsg}</span>
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={this.handleSubmit.bind(this)}>Add</Button>
                       <Button onClick={this.handleClose}>Close</Button>
                  </Modal.Actions>
                </Modal>
            </div> 
        );
    }
}


export class Customer extends React.Component {
    render() {
        return (
            <div>  
                <AddCustomer />
                <br></br>
                <Customerrecord />
            </div>         
        );
    }
}

export default Customer;