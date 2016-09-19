'use strict';
// App Dependencies
import React from "react";
var update = require('react-addons-update');
var ReactDOM = require('react-dom');
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CircularProgress from 'material-ui/CircularProgress';
import $ from 'jquery'

// Custom Components
import Menu from './components/Menu';
import ProgressStepper from './components/progressstepper.js'
import DataTable from './components/datatable.js'
import NetworkGraph from './components/networkgraph.js'
import InfoPane from './components/infopane.js'
import SelectionTable from './components/selectiontable.js'
// import Network from './components/network.js'
// Main app
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          loading: true,
          models: [],
          sampleDatasets: [],
          selectedDataset: null,
          columns: [],
          selectedColumn: null,
          observationCount: null,
          predictionType: null,
          predictionClass: null,
          suggestedModels: [],
          selectedModels: [],
          bestSeedModelTag: null,
          bestSeedModelScore: null,
          selectedSeedModel: null,
          suggestedEnsembleModels: [],
          selectedEnsembleModels: []
        }
    }
    componentWillMount () {
      this._getSampleDatasets()
      this._getModels()
    }
    // <InfoPane
    // console={this.state.console}
    // setAppState={this._setAppState}/>:
    // <div/>
    render () {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme()}>
              <div>
                {this.state.loading ?
                  <div style={{position: 'fixed', top: 20, right: 30}}>
                    <h4 style={{position: 'absolute', right: 20, width: 150, color: 'darkgrey'}}>
                      Loading...
                    </h4>
                    <CircularProgress style={{position: 'absolute', top: 0, right: 0}} mode="indeterminate" />
                  </div>:
                  <div/>
                }
                <Menu/>
                <ProgressStepper
                  _setAppState={this._setAppState}
                  _updateAppState={this._updateAppState}
                  _getSampleData={this._getSampleData}
                  _getSuggestedModels={this._getSuggestedModels}
                  _runSelectedModels={this._runSelectedModels}
                  _getEnsembleSuggestions={this._getEnsembleSuggestions}
                  _createStackedEnsemble={this._createStackedEnsemble}
                  _getPredictions={this._getPredictions}
                  {...this.state}/>
                {this.state.models.length > 0 ?
                  <NetworkGraph
                  models={this.state.models}
                  suggestedModels={this.state.suggestedModels}/> :
                  <div/>
                }
              </div>
            </MuiThemeProvider>
        )
    }
    componentDidUpdate (prevProps, prevState) {
    }
    componentDidMount () {
      this.setState({loading: false})
    }
    _setAppState = (obj) => {
      this.setState(obj)
    }
    _updateAppState = (selectionName, item) => {
      var index = this.state[selectionName].indexOf(item)
      if (index == -1) {
        var state = update(this.state, {[selectionName]: {$push: [item]}})
        this.setState(state)
      } else {
        var state =  update(this.state, {[selectionName]: {$splice: [[index, 1]]}})
        this.setState(state)
      }
    }
    _getModels () {
      $.ajax({
        url:'/getModels',
        success: response => {
            this.setState({models: JSON.parse(response)});
        }
      })
    }
    _getSampleDatasets () {
      $.ajax({
        url:'/getSampleDatasets',
        success: response => {
            this.setState({sampleDatasets: JSON.parse(response)});
        }
      })
    }
    _getSampleData = (value) => {
      $.ajax({
        url:'/getSampleData',
        data: { value: value },
        success: response => {
            this.setState({columns: JSON.parse(response)});
        }
      })
    }
    _getSuggestedModels = (value) => {
      $.ajax({
        url:'/getSuggestedModels',
        data: { value: value },
        success: response => {
            response = JSON.parse(response)
            this.setState({observationCount: response.observationCount})
            this.setState({predictionType: response.predictionType})
            this.setState({predictionClass: response.predictionClass})
            this.setState({suggestedModels: response.suggestedModels});
        }
      })
    }
    _runSelectedModels = (models, target) => {
      this.setState({loading: true})
      this.setState({console: null})
      $.ajax({
        url:'/runSelectedModels',
        data: {
          models: models.join('&'),
          target: target
        },
        success: response => {
          response = JSON.parse(response)
          var obj = this.state
          var newObj = update(obj, {table: {$set: JSON.parse(response)}});
          this.setState(newObj)
          this.setState({loading: false})
        }
      })
    }
    _getEnsembleSuggestions = (model, target, type, output) => {
      this.setState({loading: true})
      $.ajax({
        url:'/getEnsembleSuggestions',
        data: {
          model: model.substr(model.indexOf('('), model.length),
          target: target,
          type: type,
          output: output
        },
        success: response => {
          response = JSON.parse(response)
          var obj = this.state
          var newObj = update(obj, {correlation: {$set: JSON.parse(response)}});
          this.setState(newObj)
          this.setState({loading: false})
        }
      })
    }
    _createStackedEnsemble = (models) => {
      this.setState({loading: true})
      $.ajax({
        url:'/createStackedEnsemble',
        data: {
          models: models.length > 1 ? models.join('&'): models
        },
        success: response => {
          response = JSON.parse(response)
          console.log(JSON.parse(response))
          var obj = this.state
          var newObj = update(obj, {stackedstats: {$set: JSON.parse(response)}});
          this.setState(newObj)
          this.setState({loading: false})
        }
      })
    }
    _getPredictions = (observations) => {
      $.ajax({
        url:'/getPredictions',
        data: { observations: observations },
        success: response => {
            // this.setState({models: response});
            console.log(JSON.parse(response))
        }
      })
    }
    componentWillUnmount () {
    }
};

var rootInstance = ReactDOM.render(<App/>, document.getElementById('App'));

if (module.hot) {
  require('react-hot-loader/Injection').RootInstanceProvider.injectProvider({
    getRootInstances: function () {
      return [rootInstance];
    }
  });
}
