'use strict';
// App Dependencies
import React from "react";
var update = require('react-addons-update');
var ReactDOM = require('react-dom');
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import $ from 'jquery'

// Custom Components
import Menu from './components/Menu';
import ProgressStepper from './components/progressstepper.js'
import DataTable from './components/datatable.js'
import NetworkGraph from './components/networkgraph.js'
// import Network from './components/network.js'
// Main app
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          models: [],
          filterdModels: [],
          sampleDatasets: [],
          selectedDataset: null,
          columns: [],
          selectedColumn: null,
          selectedModel: null
        }
    }
    componentWillMount () {
      this._getSampleDatasets()
      this._getModels()
    }
    render () {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme()}>
              <div>
                <Menu/>
                <ProgressStepper
                  _setAppState={this._setAppState}
                  sampleDatasets={this.state.sampleDatasets}
                  selectedDataset={this.state.selectedDataset}
                  _getSampleData={this._getSampleData}
                  columns={this.state.columns}
                  selectedColumn={this.state.selectedColumn}
                  _getSuggestedModels={this._getSuggestedModels}
                  models={this.state.models}
                  selectedModel={this.state.selectedModel}
                  />
                {this.state.models.length > 0 ? <NetworkGraph items={this.state.models}/> : <div/>}
              </div>
            </MuiThemeProvider>
        )
    }
    componentDidUpdate (prevProps, prevState) {
    }
    componentDidMount () {

    }
    _setAppState = (obj) => {
      this.setState(obj)
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
        if (value.Classification == 1) {
            return value
        }
    }
      // $.ajax({
      //   url:'/getSuggestedModels',
      //   data: { value: value },
      //   success: response => {
      //       this.setState({models: JSON.parse(response)});
      //   }
      // })
    _getEnsembleSuggestions (value) {
      $.ajax({
        url:'/getEnsembleSuggestions',
        data: { value: value },
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
