import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import { Button, Header, Icon, Modal, Table, Form, Menu, TableRow, TableCell } from 'semantic-ui-react';
import axios from 'axios';

class Productrecord extends React.Component {
    constructor() {
        super();

        this.state = {
           modalOpen: false,
            items: [],
            Name: '',
            Price: 0,
            edit: false,
            dlt: false
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
            Price: member.Price,
            ProductId: member.ProductId
        }, () => console.log(this.state.ProductId));
       
    }
    deleteModal(member) {
        this.setState({
            dlt: true,
            Name: member.Name,
            Price: member.Price,
            ProductId: member.ProductId
        }, () => console.log(this.state.ProductId));

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
        $.get("/Product/GetProducts", function (data) {
            this.setState({
                items: data
            });
        }.bind(this));
    }

    componentDidUpdate() {
        $.get("/Product/GetProducts", function (data) {
            this.setState({
                items: data
            });
        }.bind(this));

    }
    handleDelete = () => {
        const Prodata = this.state.ProductId;
        //console.log(Prodata);
        //if (!confirm("Do you want to delete Product?"))
        //    return;
        //else {
        axios.delete('/Product/DeleteProduct', { data: { id: Prodata } });
        this.closeModal();
    }

    handleEdit(event) {
        //Edit functionality
        event.preventDefault();
        var Prodata = {
            Name: this.state.Name,
            Price: this.state.Price,
            ProductId: this.state.ProductId
        };
        console.log(Prodata);
        axios({
            method: 'put',
            url: '/Product/EditProduct',
            data: Prodata
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
                            <Table.HeaderCell>Product Name</Table.HeaderCell>
                            <Table.HeaderCell>Price</Table.HeaderCell>
                            <Table.HeaderCell>Edit</Table.HeaderCell>
                            <Table.HeaderCell>Delete</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.state.items.map(member =>
                            <TableRow key={member.ProductId}>
                                <TableCell>{member.Name} </TableCell>
                                <TableCell>{member.Price}</TableCell>
                                <TableCell><Button id="edtbtn" color="orange" onClick={this.editModal.bind(this, member)}><Icon name='edit'/>Edit</Button></TableCell>
                                <TableCell><Button id="dltbtn" color="red" onClick={this.deleteModal.bind(this, member)}><Icon name='trash' />Delete</Button></TableCell>
                                    
                            </TableRow>
                        )}
                    </Table.Body>
                </Table>
                     <Modal size='small' open={this.state.edit} onClose={this.closeModal}>
                    <Modal.Header>Edit Product</Modal.Header>
                    <Modal.Content>
                        <Form>
                            <Form.Field>
                                <label>Product Name</label>
                                <input name='ProductName' placeholder='Name' onChange={this.logChange} value={this.state.Name} />
                            </Form.Field>
                            <Form.Field>
                                <label>Address</label>
                                <input name='Price' placeholder='Price' onChange={this.logChange} value={this.state.Price} />
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={this.handleEdit}>Edit</Button>
                        <Button onClick={this.closeModal}>Close</Button>
                    </Modal.Actions>
                </Modal>
                <Modal size='small' open={this.state.dlt} onClose={this.closeModal}>
                    <Modal.Header>Delete Product</Modal.Header>
                    <Modal.Content>
                       <p> Are you sure you want to Delete the Product?? </p>
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






function validate(ProductName, Price) {

    return {
        ProductName: ProductName.length === 0,
        Price: Price.length < 0,
    };
    // true means invalid, so our conditions got reversed

}
class AddProduct extends React.Component {
    constructor() {
        super();
        this.state = {
            modalOpen: false,
            Name: '',
            Price: 0,
            touched: { NameValid: false, PriceValid: false },
            pronameerr: "",
            priceerr:""
        }
    }
    
    handleNameChange = (e) => {
        this.setState({Name: e.target.value})
    }
    handleAddChange = (e) => {
        this.setState({ Price: e.target.value })
    }

    canbesubmitted() {
        const errors = validate(this.state.Name, this.state.Price);
        const isDisabled = Object.keys(errors).some(x => errors[x]);
        return !isDisabled;
    }

    handleSubmit = (evt) => {
        if (!this.canbesubmitted()) {
            evt.preventDefault();
            this.setState({
                pronameerr: "Please Enter Name",
                priceerr: "Please Enter Price"
            });
            return;
        }
        else {
            this.setState({
                pronameerr: "",
                priceerr: ""
            });
        }
        var Prodata = {
            Name: this.state.Name,
            Price: this.state.Price
        };
       
        axios({
            method: 'post',
            url: '/Product/AddProduct',
            data: Prodata
        }).then(function () {
            console.log("Added");
            });
        this.handleClose();

     }
        
    handleOpen = () => this.setState({ modalOpen: true })

    handleClose = () => {
        this.state.touched.NameValid = false;
        this.state.touched.PriceValid = false;
        this.state.Name = "";
        this.state.Price = 0;
        this.setState({ modalOpen: false });
    }

    handleBlur = (field) => (evt) => {
        this.setState({
            touched: {...this.state.touched, [field]: true}
        });
    }


    render() {
        const { modalOpen } = this.state;
        const errors = validate(this.state.Name, this.state.Price);
        const isDisabled = Object.keys(errors).some(x => errors[x]);
        return (
            <div>
                <Button primary onClick={this.handleOpen}>Add Product</Button>

                <Modal size='small' open={modalOpen} onClose={this.handleClose}>
                    <Modal.Header>Add Product</Modal.Header>
                    <Modal.Content>
                        <Form>
                            <Form.Field>
                                <label>Product Name</label>
                                <input className={errors.Name} placeholder='Name' onChange={this.handleNameChange}
                                    onBlur={this.handleBlur('NameValid')} />
                                <span style={{ color: "red" }}>{this.state.pronameerr}</span>
                            </Form.Field>
                            <Form.Field>
                                <label>Price</label>
                                <input type='number' className={errors.Price} placeholder='Price' onChange={this.handleAddChange}
                                    onBlur={this.handleBlur('PriceValid')} />
                                <span style={{ color: "red" }}>{this.state.priceerr}</span>
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


export class Product extends React.Component {
    render() {
        return (
            <div>  
                <AddProduct />
                <br></br>
                <Productrecord />
            </div>
            //<CustomerTable dataUrl="/Customer/GetCustomers" />
           
        );
    }
}

ReactDOM.render(
    <Product />,
    document.getElementById('product')
);