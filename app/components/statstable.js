import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Divider from 'material-ui/Divider';

export default class SelectionTable extends React.Component {
  constructor(props) {
    super(props);
  }
  // {Object.keys(this.props.observations[0]).map( (item, i) => (
  //   <TableHeaderColumn key={item} style={{textAlign: 'center', paddingRight: 5, paddingLeft: 5}}>{item}</TableHeaderColumn>
  // ))}
  // {Object.keys(this.props.observations[i]).values.map( (el, i) => (
  //   <TableRowColumn key={el} style={{textAlign: 'center', paddingRight: 5}}>{el}</TableRowColumn>
  // ))}
  render () {
    return (
      <div style={{
        position: 'fixed',
        right: 20,
        top: 30,
        width: 550,
        height: '90%',
        overflowY: 'scroll',
        overflowX: 'scroll'
      }}>
      {this.props.type == 'prediction' ?
        <div>
          <Table
            selectable={false}
            style={{
              backgroundColor: 'rgba(255,255,255,.3)',
              maxHeight: 300,
              overflowY: 'scroll'
            }}>
          <TableHeader
            adjustForCheckbox={false}
            displaySelectAll={false}
            enableSelectAll={false}>
            <TableRow>
              <TableHeaderColumn colSpan={2} style={{textAlign: 'center'}}>
                  Predictions
              </TableHeaderColumn>
            </TableRow>
            <TableRow>
              <TableHeaderColumn key='ID' style={{textAlign: 'center', paddingRight: 5}}>ID</TableHeaderColumn>

              <TableHeaderColumn key='target' style={{textAlign: 'center', paddingRight: 5, paddingLeft: 5}}>{this.props.target}</TableHeaderColumn>

            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
          {this.props.predictions.map( (prediction, i) => (
            <TableRow key={prediction} style={{color: 'lightgrey'}}>
                <TableRowColumn key={i} style={{textAlign: 'center', paddingRight: 5}}>{i}</TableRowColumn>

                <TableRowColumn key='prediciton' style={{textAlign: 'center', paddingRight: 5, paddingLeft: 5}}>{prediction}</TableRowColumn>
            </TableRow>
          ))}
          </TableBody>
          </Table>
        </div>:
        <div/>
      }
      {this.props.type == 'stackedstats' ?
        <div>
          <Table
            selectable={false}
            style={{
              backgroundColor: 'rgba(255,255,255,.3)',
              maxHeight: 300,
              overflowY: 'scroll'
            }}>
          <TableHeader
            adjustForCheckbox={false}
            displaySelectAll={false}
            enableSelectAll={false}>
            <TableRow>
              <TableHeaderColumn colSpan={this.props.table.columns.length + 1} style={{textAlign: 'center'}}>
                  {this.props.table.metrics[0]} Stacked Ensemble
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
            <TableRow key='stackrow' style={{color: 'lightgrey'}}>
              <TableRowColumn key='Model' style={{textAlign: 'center', paddingRight: 5}}>{this.props.table.models[0]}</TableRowColumn>
              {this.props.table.stats.map( (item, i) => (
                <TableRowColumn key={item} style={{textAlign: 'center', paddingRight: 5, paddingLeft: 5}}>{item}</TableRowColumn>
              ))}
            </TableRow>
          </TableBody>
          </Table>
          <div id='stackplot' />
        </div>:
        <div/>
      }
      {this.props.type == 'summary' ?
          this.props.table.metrics.map( (metric, i) => (
            <div>
              <Table
                key={metric}
                selectable={false}
                style={{
                  backgroundColor: 'rgba(255,255,255,.3)',
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
              <div id={'plot'.concat(metric)} />
            </div>
          )) :
          <div/>
        }
        { this.props.type == 'correlation' ?
          <div>
          <Table
            selectable={false}
            style={{
              backgroundColor: 'rgba(255,255,255,.3)',
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
          <div id='correlationplot' ></div>
        </div>:
        <div/>
      }
      </div>
    )
  }
  componentDidMount  () {

    var colors = ['#00FFFF','#3d94ff','#6e3dff','#bf29ff','#FF00FF']
    if (this.props.type == 'stackedstats') {
      // var layout = {
      //   font: {
      //     family: 'Catamaran',
      //     color: 'lightgrey'
      //   },
      //   paper_bgcolor: 'rgba(255,255,255,.3)',
      //   plot_bgcolor: 'rgba(255,255,255,.4)',
      // };
      // this.props.table.metrics.map( (metric, i) => {
      //   var data = this.props.table.models.map( (model, j) => {
      //     var arr = this.props.table[metric][j]
      //     return {
      //       x: arr,
      //       type: 'box',
      //       marker: {color: colors[j]},
      //       name: model
      //     };
      //   })
      //   var id = 'plot'.concat(metric)
      //   Plotly.newPlot(id, data, layout);
      // })
    }
    if (this.props.type == 'summary') {
      var layout = {
        font: {
          family: 'Catamaran',
          color: 'lightgrey'
        },
        paper_bgcolor: 'rgba(255,255,255,.3)',
        plot_bgcolor: 'rgba(255,255,255,.4)',
      };
      this.props.table.metrics.map( (metric, i) => {
        var data = this.props.table.models.map( (model, j) => {
          var arr = this.props.table[metric][j]
          arr.pop()
          return {
            x: arr,
            type: 'box',
            marker: {color: colors[j]},
            name: model
          };
        })
        var id = 'plot'.concat(metric)
        Plotly.newPlot(id, data, layout);
      })
    }
    if (this.props.type == 'correlation') {
      var xValues = Array.prototype.slice.call(this.props.table.models)

      var yValues = Array.prototype.slice.call(this.props.table.models)
      yValues.reverse()

      var zValues = Array.prototype.slice.call(this.props.table.correlation)
      zValues.reverse()

      var colorscaleValue = [
        [0, '#00FFFF'],
        [1, '#6e3dff']
      ];

      var data = [{
        x: xValues,
        y: yValues,
        z: zValues,
        type: 'heatmap',
        colorscale: colorscaleValue,
        showscale: false
      }];

      var layout = {
        font: {
          family: 'Catamaran',
          color: 'lightgrey'
        },
        paper_bgcolor: 'rgba(255,255,255,.3)',
        plot_bgcolor: 'rgba(255,255,255,.4)',
        annotations: [],
        xaxis: {
          ticks: '',
          side: 'top'
        },
        yaxis: {
          ticks: '',
          ticksuffix: ' '
        }
      };

      for ( var i = 0; i < yValues.length; i++ ) {
        for ( var j = 0; j < xValues.length; j++ ) {
          var currentValue = zValues[i][j];
          if (currentValue != 0.0) {
            var textColor = 'black';
          }else{
            var textColor = 'black';
          }
          var result = {
            xref: 'x1',
            yref: 'y1',
            x: xValues[j],
            y: yValues[i],
            text: zValues[i][j],
            font: {
              size: 12,
              color: 'lightgrey'
            },
            showarrow: false,
            font: {
              color: textColor
            }
          };
          layout.annotations.push(result);
        }
      }
      var id = 'correlationplot'
      Plotly.newPlot(id, data, layout);
    }
  }
}
