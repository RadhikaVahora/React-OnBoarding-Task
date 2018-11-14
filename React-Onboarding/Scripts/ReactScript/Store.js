import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import { Button, Header, Icon, Modal, Table, Form, Menu, TableRow, TableCell } from 'semantic-ui-react';
import axios from 'axios';
//import { Button,Modal } from 'semantic-ui-react';

class Storerecord extends React.Component {
    constructor() {
        super();

        this.state = {
           modalOpen: false,
            items: [],
            Name: '',
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
    editModal(member) {
        this.setState({
            edit: true,
            Name: member.Name,
            Address: member.Address,
            StoreId: member.StoreId
        }, () => console.log(this.state.StoreId));
       
    }

    deleteModal(member) {
        this.setState({
            dlt: true,
            Name: member.Name,
            Address: member.Address,
            StoreId: member.StoreId
        }, () => console.log(this.state.StoreId));

    }

    closeModal() {
        this.setState({
            modalOpen: false,
            edit: false,
            dlt:false
        });
    }

    logChange(e) {
        this.setState({
            [e.target.name]: e.target.value //setting value edited by the admin in state.
        });

    }

    componentDidMount() {
        $.get("/Store/GetStore", function (data) {
            this.setState({
                items: data
            });
        }.bind(this));
    }

    componentDidUpdate() {
        $.get("/Store/GetStore", function (data) {
            this.setState({
                items: data
            });
        }.bind(this));

    }
    handleDelete = () => {
        const Strdata = this.state.StoreId;
        console.log(Strdata);
        //if (!confirm("Do you want to delete Store?"))
        //    return;
        //else {
        axios.delete('/Store/DeleteStore', { data: { id: Strdata } });
        this.closeModal();
        //}
    }

    handleEdit(event) {
        //Edit functionality
        event.preventDefault();
        var Strdata = {
            Name: this.state.Name,
            Address: this.state.Address,
            StoreId: this.state.StoreId
        };
        console.log(Strdata);
        axios({
            method: 'put',
            url: '/Store/EditStore',
            data: Strdata
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
                            <Table.HeaderCell>Store Name</Table.HeaderCell>
                            <Table.HeaderCell>Address</Table.HeaderCell>
                            <Table.HeaderCell>Edit</Table.HeaderCell>
                            <Table.HeaderCell>Delete</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.state.items.map(member =>
                            <TableRow key={member.StoreId}>
                                <TableCell>{member.Name} </TableCell>
                                <TableCell>{member.Address}</TableCell>
                                <TableCell><Button id="edtbtn" color="orange" onClick={this.editModal.bind(this, member)}><Icon name='edit' />Edit</Button></TableCell>
                                <TableCell><Button id="dltbtn" color="red" onClick={this.deleteModal.bind(this,member)} ><Icon name='trash' />Delete</Button></TableCell>
                                    
                            </TableRow>
                        )}
                        
                    </Table.Body>
                </Table>
                <Modal size='small' open={this.state.edit} onClose={this.closeModal}>
                    <Modal.Header>Edit Store</Modal.Header>
                    <Modal.Content>
                        <Form>
                            <Form.Field>
                                <label>Store Name</label>
                                <input name='StoreName' placeholder='Name' onChange={this.logChange} value={this.state.Name} />
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
                    <Modal.Header>Edit Store</Modal.Header>
                    <Modal.Content>
                        <p>Are you sure you want to delete Store?? </p>
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



function validate(StoreName, Address) {

    return {
        StoreName: StoreName.length === 0,
        Address: Address.length === 0,
    };
    // true means invalid, so our conditions got reversed

}

class AddStore extends React.Component {
    state = {
        modalOpen: false,
        Name: '',
        Address: '',
        touched: { NameValid: false, AddValid: false },
        strnameerr: "",
        adderr:""
    }
   // handleSubmit = this.handleChange.bind(this);
    //handleChange = this.handleChange.bind(this);

    handleNameChange = (e) => {
        this.setState({Name: e.target.value})
    }
    handleAddChange = (e) => {
        this.setState({ Address: e.target.value })
    }
    canBeSubmitted() {
        const errors = validate(this.state.Name, this.state.Address);
        const isDisabled = Object.keys(errors).some(x => errors[x]);
        console.log(errors);
        return !isDisabled;
    }
    handleSubmit = (evt) => {
        if (!this.canBeSubmitted()) {
            evt.preventDefault();
            this.setState({
                strnameerr: "Please Enter Name",
                adderr: "Please Enter Address"
            });
            return;
        }
        else {
            this.setState({
                strnameerr: "",
                adderr: ""
            });
        }
        var Strdata = {
            Name: this.state.Name,
            Address: this.state.Address
        };
       
        axios({
            method: 'post',
            url: '/Store/AddStore',
            data: Strdata
        }).then(function () {
            //handleClose();
            
           // this.state.modalOpen = false;
            console.log("Added");
            });
        this.handleClose();

     }
        
    handleOpen = () => this.setState({ modalOpen: true })

    handleClose = () => {
        this.state.touched.NameValid = false;
        this.state.touched.AddValid = false;
        this.state.Name = "";
        this.state.Address = "";
        this.setState({ modalOpen: false });
    }
    handleBlur = (field) => (evt) => {
        this.setState({
            touched: { ...this.state.touched, [field]: true },
        }, () => { console.log(this.state.touched); });
    }

    render() {
        const { modalOpen } = this.state;
        const errors = validate(this.state.Name, this.state.Address);
        const isDisabled = Object.keys(errors).some(x => errors[x]);
        return (
            <div>
                <Button primary onClick={this.handleOpen}>Add Store</Button>

                <Modal size='small' open={modalOpen} onClose={this.handleClose}>
                    <Modal.Header>Add Store</Modal.Header>
                    <Modal.Content>
                        <Form>
                            <Form.Field>
                                <label>Store Name</label>
                                <input name='StoreName' placeholder='Name' onChange={this.handleNameChange}
                                    onBlur={this.handleBlur('NameValid')} />
                                <span style={{ color: "red" }}>{this.state.strnameerr}</span>
                            </Form.Field>
                            <Form.Field>
                                <label>Address</label>
                                <input name='Address' placeholder='Address' onChange={this.handleAddChange}
                                    onBlur={this.handleBlur('AddValid')} />
                                <span style={{ color: "red" }}>{this.state.adderr}</span>
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={this.handleSubmit}>Add</Button>
                        <Button onClick={this.handleClose}>Close</Button>
                    </Modal.Actions>
                </Modal>
            </div>
        );
    }


}


export class Store extends React.Component {
    render() {
        return (
            <div>  
                <AddStore />
                <br></br>
                <Storerecord />
            </div>
            //<CustomerTable dataUrl="/Customer/GetCustomers" />
           
        );
    }
}

ReactDOM.render(
    <Store />,
    document.getElementById('store')
);