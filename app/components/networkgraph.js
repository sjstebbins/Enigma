import React from 'react';

export default class NetworkGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: 0};
  }
  componentWillMount () {

  }
  componentWillReceiveProps (nextProps) {

  }
  render() {
    return (
      <div id="network" />
    );
  }
  componentDidMount () {
    var graph = require('ngraph.graph')();
    //add column clusters
    for (var category in this.props.items[0]) {
      graph.addNode(category);
    }
    this.props.items.forEach( (item, i) => {
      graph.addNode(item.Model);
      // for (var category in item) {
      //   if (item[category] == 1) {
      //     graph.addLink(item, category);
      //   }
      // }
    })

    var renderGraph = require('ngraph.pixel');
    var renderer = renderGraph(graph, {
      settings: true
      // physics: {
      //   springLength : 80,
      //   springCoeff : 0.0002,
      //   gravity: -1.2,
      //   theta : 0.8,
      //   dragCoeff : 0.02
      // }
    })

    renderer.on('nodeclick', function(node) {
      console.log('Clicked on ' + JSON.stringify(node));
    });
    //
    // renderer.on('nodedblclick', function(node) {
    //   console.log('Double clicked on ' + JSON.stringify(node));
    // });
    //
    // renderer.on('nodehover', function(node) {
    //   console.log('Hover node ' + JSON.stringify(node));
    // });

  }
}
