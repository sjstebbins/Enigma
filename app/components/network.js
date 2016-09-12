import React from 'react'
var d3 = require('d3')
import _ from 'underscore'

var width = 960;
var height = 500;
var force = d3.layout.force()
  .charge(-300)
  .gravity(.05)
  .linkDistance(50)
  .size([width, height]);

const styles = {
  update: {
    color: 'grey',
    position: 'absolute',
    top: 10,
    left: 10,
    padding: '5px 10px',
    margin: 10,
    cursor: 'pointer',
    borderColor: 'lightgrey',
    borderWidth: 1,
    borderRadius: 3
  },
  nodecircle: {
    fill: 'grey',
    stroke: 'grey',
    strokeWidth: 2
  },
  nodetext: {
    fill: 'grey',
    stroke: 'none',
    fontSize: 3
  },
  line: {
    stroke: 'lightgrey',
    strokeOpacity: .6
  }
}

export default class Network extends React.Component {
  state = {
    nodes: [],
    links: []
  }
  componentWillMount() {
    force.on('tick', () => {
      // after force calculation starts, call
      // forceUpdate on the React component on each tick
      this.forceUpdate()
    });
  }

  componentWillReceiveProps(nextProps) {
    // we should actually clone the nodes and links
    // since we're not supposed to directly mutate
    // props passed in from parent, and d3's force function
    // mutates the nodes and links array directly
    // we're bypassing that here for sake of brevity in example
    force.nodes(nextProps.nodes).links(nextProps.links);

    force.start();
  }

  render() {
    // use React to draw all the nodes, d3 calculates the x and y
    var nodes = _.map(this.state.nodes, (node) => {
      var transform = 'translate(' + node.x + ',' + node.y + ')';
      return (
        <g key={node.key} transform={transform}>
          <circle style={styles.nodecircle} r={node.size} />
          <text style={styles.nodetext} x={node.size + 5} dy='.35em'>{node.key}</text>
        </g>
      );
    });
    var links = _.map(this.state.links, (link) => {
      return (
        <line style={styles.line} key={link.key} strokeWidth={link.size}
          x1={link.source.x} x2={link.target.x} y1={link.source.y} y2={link.target.y} />
      );
    });

    return (
      <svg width={width} height={height}>
        <g>
          {links}
          {nodes}
        </g>
      </svg>
    );
  }
  componentDidMount () {
    setInterval(() => {
      this.updateData();
    }, 5000)
  }
  randomData (nodes, width, height) {
      var oldNodes = nodes;
      // generate some data randomly
      nodes = _.chain(_.range(_.random(10, 30)))
        .map(function() {
          var node = {};
          node.key = _.random(0, 30);
          node.size = _.random(4, 10);

          return node;
        }).uniq(function(node) {
          return node.key;
        }).value();

      if (oldNodes) {
        var add = _.initial(oldNodes, _.random(0, oldNodes.length));
        add = _.rest(add, _.random(0, add.length));

        nodes = _.chain(nodes)
          .union(add).uniq(function(node) {
            return node.key;
          }).value();
      }

      var links = _.chain(_.range(_.random(15, 35)))
        .map(function() {
          var link = {};
          link.source = _.random(0, nodes.length - 1);
          link.target = _.random(0, nodes.length - 1);
          link.key = link.source + ',' + link.target;
          link.size = _.random(1, 3);

          return link;
        }).uniq((link) => link.key)
        .value();

      this.maintainNodePositions(oldNodes, nodes, width, height);

      return {nodes, links};
    }

    maintainNodePositions (oldNodes, nodes, width, height) {
      var kv = {};
      _.each(oldNodes, function(d) {
        kv[d.key] = d;
      });
      _.each(nodes, function(d) {
        if (kv[d.key]) {
          // if the node already exists, maintain current position
          d.x = kv[d.key].x;
          d.y = kv[d.key].y;
        } else {
          // else assign it a random position near the center
          d.x = width / 2 + _.random(-150, 150);
          d.y = height / 2 + _.random(-25, 25);
        }
      });
    }
    updateData() {
      // randomData is loaded in from external file generate_data.js
      // and returns an object with nodes and links
      var newState = this.randomData(this.state.nodes, 960, 500);
      this.setState(newState);
    }
};
