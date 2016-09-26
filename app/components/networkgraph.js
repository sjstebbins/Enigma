import React from 'react';

export default class NetworkGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      renderer: null,
      value: 0
    };
  }
  componentWillMount () {

  }
  componentWillReceiveProps (nextProps) {
    // if (this.props.suggestedModels !== nextProps.suggestedModels) {
    //   // console.log(this.state.renderer.graph())
    //   // // this.state.renderer.graph().forEachLinkedNode('hello', (linkedNode, link) => {
    //   // //   console.log(link)
    //   // //   this.state.renderer.graph().removeLink(link);
    //   // // });
    //   //
    //   var categories =[]
    //   for (var category in this.props.models[0]) {
    //     if (category !== 'Model' && category !== 'Tag') {
    //       categories.push(category)
    //     }
    //   }
    //   //
    //   this.state.renderer.forEachNode( (nodeUI) => {
    //     if (nextProps.suggestedModels.indexOf(nodeUI.id) == -1 && categories.indexOf(nodeUI.id) == -1) {
    //       this.state.renderer.graph().forEachLinkedNode(nodeUI.id, (linkedNode, link) => {
    //         this.state.renderer.graph().removeLink(link);
    //       });
    //       // this.state.renderer.graph().removeNode(nodeUI.id)
    //       // nodeUI.data = 'hidden'
    //       // nodeUI.color = 0x2F4F4F
    //         // this.state.renderer.graph().removeNode(nodeUI.id)
    //     }
    //   });
    //   // // //
    //   // this.state.renderer.forEachLink( (linkUI, i) => {
    //   //   if (nextProps.suggestedModels.indexOf(linkUI.from.id) == -1) {
    //   //     linkUI.toColor = 0x2F4F4F
    //   //     linkUI.fromColor = 0x2F4F4F
    //   //   }
    //   // });
    // }
  }
  render() {
    return (
      <div id="network" />
    );
  }
  componentDidMount () {
    if (this.props.suggestedModels.length > 0) {
      this._createNetwork('suggestedModels')
    } else {
      this._createNetwork('models')
    }
  }
  _createNetwork (nodes) {
    var graph = require('ngraph.graph')()
    //add column clusters
    for (var category in this.props[nodes][0]) {
      if (category !== 'Model' && category !== 'Tag') {
        graph.addNode(category);
      }
    }
    this.props[nodes].forEach( (item, i) => {
      graph.addNode(item.Model);

      for (var category in item) {
        if (category !== 'Model' && category !== 'Tag') {
          if (item[category] == 1) {
            graph.addLink(item.Model, category, {}, category)
          }
        }
      }

    })
    var renderGraph = require('ngraph.pixel');
    var renderer = renderGraph(graph, {
      link: (link) => {
        if (link.data === 'hidden') {return} // don't need to render!
        return {
          fromColor: 0xFF00FF,
          toColor: 0x00FFFF
        };
      },
      node: (node) => {
        if (node.data === 'hidden') {return} // don't need to render!
        return {
          color: 0xFF00FF,
          size: 100
        };
      },
      physics: {
        springLength : 5000,
        springCoeff : 0.0002,
        gravity: -20,
        theta : .8,
        dragCoeff : 0.02,
        timeStep: 25
      }
    })

    //make category nodes bigger and blue
    for (var category in this.props[nodes][0]) {
      if (category !== 'Model' && category !== 'Tag') {
        var nodeUI = renderer.getNode(category);
        nodeUI.color = 0x00FFFF; // update node color
        nodeUI.size = 250; // update size
      }
    }
    // var createSettingsView = require('config.pixel');
    // var createLegend = require('edgelegend');
    // var settings = createSettingsView(renderer);
    // settings.remove(['View Settings', 'Layout Settings']);
    //
    // createLegend(settings, 'Groups', [{
    //   name: 'First',
    //   color: 0xff0000,
    //   filter: function (link) { return link.fromId; }
    // }, {
    //   name: 'Second',
    //   color: 0x00ff00,
    //   filter: function(link) {
    //     return
    //     // return 33 < link.fromId && link.fromId <= 66;
    //   }
    // },{
    //   name: 'Third',
    //   color: 0x0000ff,
    //   filter: function(link) {
    //     return link
    //     // return 66 < link.fromId;
    //   }
    // }
    // ]);

    renderer.on('nodeclick', function(node) {
      console.log('Clicked on ' + JSON.stringify(node));
    });

    // renderer.on('nodehover', function(node) {
    //   console.log('Hover node ' + JSON.stringify(node));
    // });

    //pass to state so it can be updated on props changes
    this.setState({renderer: renderer})
  }
}
