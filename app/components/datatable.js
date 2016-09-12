import React from 'react';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn}
  from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';

const styles = {
  propContainer: {
    width: 200,
    overflow: 'hidden',
    margin: '20px auto 0',
  },
  propToggleHeader: {
    margin: '20px auto 10px',
  },
};

const tableData = [
  {
    name: 'John Smith',
    status: 'Employed',
    selected: true,
  },
  {
    name: 'Randal White',
    status: 'Unemployed',
  },
  {
    name: 'Stephanie Sanders',
    status: 'Employed',
    selected: true,
  },
  {
    name: 'Steve Brown',
    status: 'Employed',
  },
  {
    name: 'Joyce Whitten',
    status: 'Employed',
  },
  {
    name: 'Samuel Roberts',
    status: 'Employed',
  },
  {
    name: 'Adam Moore',
    status: 'Employed',
  },
];

export default class DataTable extends React.Component {

    constructor(props) {
      super(props);

      this.state = {
        fixedHeader: true,
        fixedFooter: false,
        stripedRows: false,
        showRowHover: false,
        selectable: false,
        multiSelectable: false,
        enableSelectAll: false,
        deselectOnClickaway: true,
        showCheckboxes: false,
      };
    }

    handleToggle = (event, toggled) => {
      this.setState({
        [event.target.name]: toggled,
      });
    };

    handleChange = (event) => {
      this.setState({height: event.target.value});
    };

    render() {
      return (
          <Table
            style={{
              marginLeft: 300,
              zIndex: 2,
              backgroundColor: 'transparent',
              color: 'white',
              top: 50,
              width: 'calc(90% - 300px)',
              position: 'fixed'
            }}
            height={this.state.height}
            fixedHeader={this.state.fixedHeader}
            fixedFooter={this.state.fixedFooter}
            selectable={this.state.selectable}
            multiSelectable={this.state.multiSelectable}
          >
            <TableHeader
              displaySelectAll={this.state.showCheckboxes}
              adjustForCheckbox={this.state.showCheckboxes}
              enableSelectAll={this.state.enableSelectAll}
            >
              <TableRow style={{color: 'lightgrey'}}>
                <TableHeaderColumn colSpan="2" tooltip="Super Header" style={{textAlign: 'center'}}>
                  {this.props.selectedDataset}
                </TableHeaderColumn>
              </TableRow>
              <TableRow style={{color: 'lightgrey'}}>
                <TableHeaderColumn tooltip="The ID">ID</TableHeaderColumn>
                <TableHeaderColumn tooltip="The Name">Name</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody
              style={{marginTop: '165px !important'}}
              displayRowCheckbox={this.state.showCheckboxes}
              deselectOnClickaway={this.state.deselectOnClickaway}
              showRowHover={this.state.showRowHover}
              stripedRows={this.state.stripedRows}
            >
              {this.props.items.map( (item, index) => (
                <TableRow key={index} style={{color: 'lightgrey'}}>
                  <TableRowColumn>{index}</TableRowColumn>
                  <TableRowColumn>{item}</TableRowColumn>
                </TableRow>
                ))}
            </TableBody>
          </Table>
      );
    }
}
