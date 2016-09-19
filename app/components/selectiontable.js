import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Divider from 'material-ui/Divider';

export default class SelectionTable extends React.Component {
  constructor(props) {
    super(props);
  }
  render () {
    return (
      <div style={{
        position: 'fixed',
        right: 20,
        top: 30,
        width: 550
      }}>
      {this.props.type == 'summary' ?
          this.props.table.metrics.map( (metric, i) => (
            <div>
              <Table
                selectable={false}
                style={{
                  backgroundColor: 'rgba(255,255,255,.2)',
                  maxHeight: 300,
                  overflowY: 'scroll'
                }}>
              <TableHeader
                adjustForCheckbox={false}
                displaySelectAll={false}
                enableSelectAll={false}>
                <TableRow>
                     <TableHeaderColumn colSpan={this.props.table.columns.length + 1} style={{textAlign: 'center'}}>
                       {metric}
                     </TableHeaderColumn>
                   </TableRow>
                <TableRow>
                  <TableHeaderColumn key='Model' style={{textAlign: 'center', paddingRight: 5}}>Model</TableHeaderColumn>
                  {this.props.table.columns.map( (item, i) => (
                    <TableHeaderColumn key={item} style={{textAlign: 'center', paddingRight: 5, paddingLeft: 5}}>{item}</TableHeaderColumn>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                {this.props.table[metric].map( (row, i) => (
                  <TableRow key={i} style={{color: 'lightgrey'}}>
                    <TableRowColumn key='Model' style={{textAlign: 'center', paddingRight: 5}}>{this.props.table.models[i]}</TableRowColumn>
                    {row.map( (item, i) => (
                      <TableRowColumn key={item} style={{textAlign: 'center', paddingRight: 5, paddingLeft: 5}}>{item}</TableRowColumn>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
              </Table>
              {i != this.props.table.metrics.length ?
                <Divider />:
                <div/>
              }
            </div>
          )) :
        <Table
          selectable={false}
          style={{
            backgroundColor: 'rgba(255,255,255,.2)',
            maxHeight: 300,
            overflowY: 'scroll'
          }}>
          <TableHeader
            adjustForCheckbox={false}
            displaySelectAll={false}
            enableSelectAll={false}>
            <TableRow>
                 <TableHeaderColumn colSpan={this.props.table.columns.length + 1} style={{textAlign: 'center'}}>
                   Correlation
                 </TableHeaderColumn>
               </TableRow>
            <TableRow>
              <TableHeaderColumn key='Model' style={{textAlign: 'center', paddingRight: 5}}>Model</TableHeaderColumn>
              {this.props.table.columns.map( (item, i) => (
                <TableHeaderColumn key={item} style={{textAlign: 'center', paddingRight: 5, paddingLeft: 5}}>{item}</TableHeaderColumn>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {this.props.table.correlation.map( (row, i) => (
              <TableRow key={i} style={{color: 'lightgrey'}}>
                <TableRowColumn key='Model' style={{textAlign: 'center', paddingRight: 5}}>{this.props.table.models[i]}</TableRowColumn>
                {row.map( (item, i) => (
                  <TableRowColumn key={item} style={{textAlign: 'center', paddingRight: 5, paddingLeft: 5}}>{item}</TableRowColumn>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      }
      </div>
    )
  }
}
