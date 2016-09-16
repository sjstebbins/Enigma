import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';


export default class SelectionTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render () {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderColumn>Model</TableHeaderColumn>
            <TableHeaderColumn>Accuracy</TableHeaderColumn>
            <TableHeaderColumn>Kappa</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
          {this.props.items.length > 0 ? this.props.items.map( (item, i) => (
            <TableRow key={item}>
              <TableRowColumn>1</TableRowColumn>
              <TableRowColumn>John Smith</TableRowColumn>
              <TableRowColumn>Employed</TableRowColumn>
            </TableRow>
          )):<div/>}
        </TableBody>
      </Table>
    )
  }
}
