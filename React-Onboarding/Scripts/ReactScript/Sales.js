import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import { Button, Header, Icon, Modal, Table, Form, Menu, TableRow, TableCell,Dropdown } from 'semantic-ui-react';
import axios from 'axios';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

class Salesrecord extends React.Component {
    constructor() {
        super();
        this.state = {
          // modalOpen: false,
            items: [],
            CustomerName: '',
            ProductName: '',
            StoreName: '',
            StDate: '',
            edit: false,
            CusId: '',
            PdtId: '',
            StrId: '',
            SleId: '',
            Customers: [],
            Products: [],
            Stores: [],
            dlt: false
        };
        this.editModal = this.editModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleEdit = this.handleEdit.bind(this); // Function where we submit data
        this.deleteModal = this.deleteModal.bind(this);

    }
    editModal(member) {
        var Sldata = member.SaleId;
        
        this.setState({
            edit: true, 
            SleId: member.SaleId,
            CusId: member.CustomerId,
            PdtId: member.ProductId,
            StrId: member.StoreId,
            CustomerName: member.CustomerName,
            ProductName: member.ProductName,
            StoreName: member.StoreName,
            StDate: moment(member.Date)
        },() => console.log(member.Date));      
    }

    deleteModal(member) {
        this.setState({
            dlt: true,
            SleId: member.SaleId
        }, () => console.log(this.state.SleId));
    }

    closeModal() {
        this.setState({
            edit: false,
            dlt: false
        });
    }

    handleCtrNameChange = (e, { value }) => {
        this.setState({ CusId: value }, () => { console.log(this.state.CusId); })
    }
    handlePdtChange = (e, { value }) => {
        this.setState({ PdtId: value }, () => { console.log(this.state.PdtId); })
    }

    handleStrChange = (e, { value }) => {
        this.setState({ StrId: value }, () => { console.log(this.state.StrId); })
    }

    handleChange = (date) => {
        this.setState({ StDate: date }, () => { console.log(this.state.StDate); })
    }

    componentDidMount() {
        $.get("/Sales/GetSalesRecord", function (data) {
            this.setState({
                items: data
            });
        }.bind(this));
        $.get("/Customer/GetCustomers", function (data) {
            this.setState({
                Customers: data
            });
        }.bind(this));

        $.get("/Product/GetProducts", function (data) {
            this.setState({
                Products: data
            });
        }.bind(this));

        $.get("/Store/GetStore", function (data) {
            this.setState({
                Stores: data
            });
        }.bind(this));
    }

    componentDidUpdate() {
        $.get("/Sales/GetSalesRecord", function (data) {
            this.setState({
                items: data
            });
        }.bind(this));
    }

    handleDelete = () => {
        const Strdata = this.state.SleId;
        console.log(Strdata);
        axios.delete('/Sales/Delete', { data: { id: Strdata } });
        this.closeModal();
    }

    handleEdit(event) {
        //Edit functionality
         var todate = moment(this.state.StDate).toDate();
        var CDate = moment(todate).format("YYYY-MM-DD");
        console.log(CDate);
        var Strdata = {
            SaleId: this.state.SleId,
            CustomerId: this.state.CusId,
            ProductId: this.state.PdtId,
            StoreId: this.state.StrId,
            Date: CDate
        };
        console.log(Strdata);
        axios({
            method: 'put',
            url: '/Sales/Edit',
            data: Strdata
        }).then(function () {
            console.log("Added");
        });
        this.closeModal();
    }

    render() {

        const { customerlist } = this.state.Customers
        const { productlist } = this.state.Products
        const { storelist } = this.state.Stores
        const Cusoptions = this.state.Customers.map(C => (
            { key: C.CustomerId, text: C.CustomerName, value: C.CustomerId }));
        const Prooptions = this.state.Products.map(p => ({ key: p.ProductId, text: p.Name, value: p.ProductId }));
        const Stroptions = this.state.Stores.map(st => ({ key: st.StoreId, text: st.Name, value: st.StoreId }));
        const salerecord = this.state.items.map(s => ({key: s.SaleId}));
       
        return (
            <div>
                <Table celled striped selectable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Customer Name</Table.HeaderCell>
                            <Table.HeaderCell>Product Name</Table.HeaderCell>
                            <Table.HeaderCell>Store Name</Table.HeaderCell>
                            <Table.HeaderCell>Date</Table.HeaderCell>
                            <Table.HeaderCell>Edit</Table.HeaderCell>
                            <Table.HeaderCell>Delete</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.state.items.map(member =>
                            <TableRow key={member.SaleId}>
                                <TableCell>{member.CustomerName} </TableCell>
                                <TableCell>{member.ProductName} </TableCell>
                                <TableCell>{member.StoreName} </TableCell>
                                <TableCell>{moment(member.Date).format('DD-MM-YYYY')}</TableCell>
                                <TableCell><Button id="edtbtn" color="orange" onClick={this.editModal.bind(this, member)}><Icon name='edit' />Edit</Button></TableCell>
                                <TableCell><Button id="dltbtn" color="red" onClick={this.deleteModal.bind(this, member)}><Icon name='trash' />Delete</Button></TableCell>      
                            </TableRow>
                        )}
                        
                    </Table.Body>
                </Table>
                <Modal size='small' open={this.state.edit} onClose={this.handleClose}>
                    <Modal.Header>Edit Sale Record</Modal.Header>
                    <Modal.Content>
                        <Form>
                            <Form.Field>
                                <label>Customer Name</label>
                                <Dropdown
                                    onChange={this.handleCtrNameChange.bind(this)}
                                    options={Cusoptions}
                                    placeholder='Select Customer'
                                    selection
                                    value={customerlist}
                                    defaultValue={this.state.CusId}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Product Name</label>
                                <Dropdown
                                    onChange={this.handlePdtChange.bind(this)}
                                    options={Prooptions}
                                    placeholder='Select Product'
                                    selection
                                    value={productlist}
                                    defaultValue={this.state.PdtId}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Store Name</label>
                                <Dropdown
                                    onChange={this.handleStrChange.bind(this)}
                                    options={Stroptions}
                                    placeholder='Select Store'
                                    selection
                                    value={storelist}
                                    defaultValue={this.state.StrId}
                                    
                                />
                            </Form.Field>
                            <label> Date </label>
                            <DatePicker selected={this.state.StDate} onChange={this.handleChange.bind(this)} tabIndex={1}/>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={this.handleEdit}>Edit</Button>
                        <Button onClick={this.closeModal}>Close</Button>
                    </Modal.Actions>
                </Modal>
                <Modal size='small' open={this.state.dlt} onClose={this.closeModal}>
                    <Modal.Header>Delete Sale Record</Modal.Header>
                    <Modal.Content>
                        <p> Are you sure you want to Delete the Sale?? </p>
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

function validate(CusName,ProName,StrName,Date) {
    return {
        CustomerName: CusName === "",
        ProductName: ProName === "",
        StoreName: StrName === "",
        Date: Date == ""
    };
}

class AddSale extends React.Component {
    constructor() {
        super();
        this.state = {
            modalOpen: false,
            CustomerName: '',
            ProductName: '',
            StoreName: '',
            CusId: '',
            Customers: [],
            PdtId: '',
            Products: [],
            StrId: '',
            Stores: [],
            StartDate: moment(),
            CusName: false,
            ProName: false,
            StrName: false,
            DateStatus: false,
            Cuserr: "",
            Proerr: "",
            Strerr:""
        };
    }

    componentDidMount() {
        $.get("/Customer/GetCustomers", function (data) {
            this.setState({
                Customers: data
            });
        }.bind(this));

        $.get("/Product/GetProducts", function (data) {
            this.setState({
                Products: data
            });
        }.bind(this));

        $.get("/Store/GetStore", function (data) {
            this.setState({
                Stores: data
            });
        }.bind(this));
    }

    canBeSubmitted() {
        const errors = validate(this.state.CusId, this.state.PdtId, this.state.StrId,this.state.StartDate);
        const isDisabled = Object.keys(errors).some(x => errors[x]);
        console.log(errors);
        return !isDisabled;
    }
    
    handledropChange = (e, { value}) => {
        this.setState({value})

    }
    
    handleCtrNameChange = (e, {value}) => {
        this.setState({
            CusId: value,
            CusName: true
        }, () => { console.log(this.state.CusId); });
        //this.handleclick();
    }
    handlePdtChange = (e, {value}) => {
        this.setState({
            PdtId: value,
            ProName: true
        }, () => { console.log(this.state.PdtId); });
        //this.handleclick();
    }

    handleStrChange = (e, {value}) => {
        this.setState({
            StrId: value,
            StrName: true
        }, () => { console.log(this.state.StrId); });
        //this.handleclick();
    }

    handleChange = (date) => {
        this.setState({
            StartDate: date,
            DateStatus: true
        }, () => { console.log(this.state.StartDate); });
        //this.handleclick();
    }

    handleSubmit = (evt) => {
        if (!this.canBeSubmitted()) {
            evt.preventDefault();
            this.setState({
                Cuserr: "Please Select Customer",
                Proerr: "Please Select Product",
                Strerr: "Please Select Store"
            });
            return;
        }
        else {
            this.setState({
                Cuserr: "",
                Proerr: "",
                Strerr: ""
            });
        }

        var date = moment(this.state.StartDate).toDate();
        var datefr = moment(date).format("YYYY-MM-DD");
        
        var Strdata = {
            CustomerId: this.state.CusId,
            ProductId: this.state.PdtId,
            StoreId: this.state.StrId,
            Date: datefr
        };
        console.log(date);
        console.log(Strdata);
        axios({
            method: 'post',
            url: '/Sales/Create',
            data: Strdata
        }).then(function () {

            console.log("Added");
            });
        this.handleClose();

     }
        
    handleOpen = () => this.setState({ modalOpen: true })

    handleClose = () => {
        this.state.CusName = false;
        this.state.ProName = false;
        this.state.StrName = false;
        this.state.DateStatus = false;
        this.state.CusId = '';
        this.state.PdtId = '';
        this.state.StrId = '';
        this.state.StartDate = moment();
        this.setState({ modalOpen: false });
    }

    render() {
        const { modalOpen } = this.state;
        const { customerlist } = this.state.Customers
        const { productlist } = this.state.Products
        const { storelist} = this.state.Stores
        const Cusoptions = this.state.Customers.map(C => (
            { key: C.CustomerId, text: C.CustomerName, value: C.CustomerId }));
        const Prooptions = this.state.Products.map(p => ({ key: p.ProductId, text: p.Name, value: p.ProductId }));
        const Stroptions = this.state.Stores.map(p => ({ key: p.StoreId, text: p.Name, value: p.StoreId }));
        const errors = validate(this.state.CusId, this.state.PdtId, this.state.StrId, this.state.StartDate);
        const isDisabled = Object.keys(errors).some(x => errors[x]);
           
        return (
            <div>
                <Button primary onClick={this.handleOpen}>Add Sale Record</Button>

                <Modal size='small' open={modalOpen} onClose={this.handleClose}>
                    <Modal.Header>Add Sale Record</Modal.Header>
                    <Modal.Content>
                        <Form>
                            <Form.Field>
                                <label>Customer Name</label>
                                <Dropdown
                                    onChange={this.handleCtrNameChange.bind(this)}
                                    options={Cusoptions}
                                placeholder='Select Customer'
                                selection
                                    value={customerlist}
                                />
                                <span style={{ color: "red" }}>{this.state.Cuserr}</span>
                            </Form.Field>
                            <Form.Field>
                                <label>Product Name</label>
                                <Dropdown
                                    onChange={this.handlePdtChange}
                                    options={Prooptions}
                                    placeholder='Select Product'
                                    selection
                                    value={productlist}
                                />
                                <span style={{ color: "red" }}>{this.state.Proerr}</span>
                            </Form.Field>
                            <Form.Field>
                                <label>Store Name</label>
                                <Dropdown
                                    onChange={this.handleStrChange}
                                    options={Stroptions}
                                    placeholder='Select Store'
                                    selection
                                    value={storelist}
                                />
                                <span style={{ color: "red" }}>{this.state.Strerr}</span>
                            </Form.Field>
                            <label> Date </label>
                            <DatePicker selected={this.state.StartDate} onChange={this.handleChange.bind(this)} tabIndex={1} />
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


export class Sales extends React.Component {
    render() {
        return (
            <div>  
                <AddSale />
                <br></br>
                <Salesrecord />
            </div>
        );
    }
}

ReactDOM.render(
    <Sales />,
    document.getElementById('sales')
);