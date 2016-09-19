import React from 'react';
import $ from 'jquery'
import {
  Step,
  Stepper,
  StepLabel,
  StepContent
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import ExpandTransition from 'material-ui/internal/ExpandTransition';
import TextField from 'material-ui/TextField';
import FontIcon from 'material-ui/FontIcon'
import CircularProgress from 'material-ui/CircularProgress';

// custom components
import LongDropDownMenu from './dropdown.js'
import DataTable from './datatable.js'
import MultiDropDown from './multidropdown.js'
import SelectionTable from './selectiontable.js'

 const styles = {
   exampleImageInput: {
     cursor: 'pointer',
     position: 'absolute',
     top: 0,
     bottom: 0,
     right: 0,
     left: 0,
     width: '100%',
     opacity: 0,
   },
 };

class ProgressStepper extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        finished: false,
        stepIndex: 0
      }
  }

  handleNext = (selection, onClickFunction) => {
    const {stepIndex} = this.state;
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 4,
    });
    var args = null
    if (selection == 'selectedModels') {
      args = this.props['selectedColumn']
    }
    if (selection == 'selectedSeedModel') {
      onClickFunction(this.props[selection], this.props.selectedColumn, this.props.predictionType, this.props.predictionClass)
      return
    }
    if (selection == 'selectedEnsembleModels') {
      onClickFunction(this.props[selection])
      return
    }
    onClickFunction(this.props[selection], args)
  };

  handlePrev = (selection) => {
    const {stepIndex} = this.state;
    if (stepIndex > 0) {
      this.props._setAppState({[selection]: null})
      this.setState({stepIndex: stepIndex - 1});
    }
  };
  renderStepActions(step, hold, selection, onClickFunction) {
    const {stepIndex} = this.state;

    return (
      <div style={{margin: '12px 0', color: 'white'}}>
        <RaisedButton
          label={stepIndex === 5 ? 'Finish' : 'Next'}
          disabled={hold}
          primary={true}
          onTouchTap={this.handleNext.bind(this, selection, onClickFunction)}
          style={{marginRight: 12}}
        />
        {step > 0 && (
          <FlatButton
            label="Back"
            backgroundColor='rgba(229, 229, 229, .4)'
            disabled={stepIndex === 0}
            onTouchTap={this.handlePrev.bind(this, selection)}
          />
        )}
      </div>
    );
  }

  // <FlatButton label="Upload Data" icon={<FontIcon className="muidocs-icon-custom-github" />}>
  //   <input type="file" style={styles.exampleImageInput} />
  // </FlatButton>
  // <DataTable
  //   items={this.props.columns}
  //   selectedDataset={this.props.selectedDataset}/>

  // <Step>
  //   <StepLabel style={{color: this.state.stepIndex > 1 ? 'rgb(0, 188, 212)' : 'lightgrey'}}>Clean Data</StepLabel>
  //   <StepContent>
  //     <p>
  //     </p>
  //     <LongDropDownMenu
  //       items={this.props.suggestedModels.sort()}
  //       _setAppState={this.props._setAppState}
  //       selectedValue={this.props.selectedModel}
  //       selectionName='selectedModel'/>
  //     {this.renderStepActions(2, (this.props.selectedModel == null ? true : false), 'selectedModel', this.props._runSelectedModels)}
  //   </StepContent>
  // </Step>
  componentWillReceiveProps (nextProps) {
    if (this.props.table != nextProps.table && nextProps.table != undefined) {
      var means = nextProps.table.models.map( (item, i) => {
        return nextProps.table[nextProps.table.metrics[0]][i][3]
      })
      var bestSeedModelScore = Math.max.apply(null, means)
      var bestSeedModelTag = nextProps.table.models[means.indexOf(bestSeedModelScore)]
      var selectedSeedModel = nextProps.selectedModels[means.indexOf(bestSeedModelScore)]
      nextProps._setAppState({selectedSeedModel: selectedSeedModel})
      nextProps._setAppState({bestSeedModelTag: bestSeedModelTag})
      nextProps._setAppState({bestSeedModelScore: bestSeedModelScore})
    }
  }
  render() {
    const {finished, stepIndex} = this.state;


    // <LongDropDownMenu
    //   items={this.props.suggestedModels.sort()}
    //   _setAppState={this.props._setAppState}
    //   selectedValue={this.props.selectedModel}
    //   selectionName='selectedModel'
    //   checkboxes={true}/>
          // Enigma has preselected the models with less than 75% correlation.
    return (
      <div style={{
          maxWidth: 300,
          maxHeight: 400,
          margin: 'auto',
          marginLeft: '.5%'
        }}>
        <Stepper activeStep={stepIndex} orientation="vertical" style={{maxWidth: 300, position: 'fixed', marginTop: 60, color: 'white', zIndex: 5}}>
          <Step>
            <StepLabel style={{color: this.state.stepIndex > -1 ? 'rgb(0, 188, 212)' : 'lightgrey'}}>Select Dataset: {this.props.selectedDataset}</StepLabel>
            <StepContent>
              <p>Welcome to Enigma. Please upload a dataset or select a sample data.</p>
              <form encType="multipart/form-data" action="/post_data" method="post">

              </form>
              <LongDropDownMenu
                items={this.props.sampleDatasets.sort()}
                _setAppState={this.props._setAppState}
                selectedValue={this.props.selectedDataset}
                selectionName='selectedDataset'/>
              {this.renderStepActions(0, (this.props.selectedDataset == null ? true : false), 'selectedDataset', this.props._getSampleData)}
            </StepContent>
          </Step>

          <Step>
            <StepLabel style={{color: this.state.stepIndex > 0 ? 'rgb(0, 188, 212)' : 'lightgrey'}}>Select Target: {this.props.selectedColumn}</StepLabel>
            <StepContent>
              <p>Select a target column to predict.</p>
              <LongDropDownMenu
                items={this.props.columns}
                _setAppState={this.props._setAppState}
                selectedValue={this.props.selectedColumn}
                selectionName='selectedColumn'/>
              {this.renderStepActions(1, (this.props.selectedColumn == null ? true : false), 'selectedColumn',this.props._getSuggestedModels)}
            </StepContent>
          </Step>
          <Step>
            <StepLabel style={{color: this.state.stepIndex > 1 ? 'rgb(0, 188, 212)' : 'lightgrey'}}>Try Models: {this.props.selectedModels.length < 2 ? this.props.selectedModels[0]: this.props.selectedModels.length.toString() + ' Models'} </StepLabel>
            <StepContent>
              <p>
                Prediction column requires <span style={{color: 'rgba(255, 0, 255, 1)'}}>{this.props.predictionClass} {this.props.predictionType}. </span>
                There are <span style={{color: 'rgba(255, 0, 255, 1)'}}>{this.props.observationCount}</span> observations. Please select from the <span style={{color: 'rgba(255, 0, 255, 1)'}}>
                {this.props.suggestedModels.length}</span> suggested model based on these parameters.
              </p>
              <MultiDropDown
                _setAppState={this.props._setAppState}
                _updateAppState={this.props._updateAppState}
                label='Seed Models'
                items={this.props.suggestedModels.sort()}
                selectionName='selectedModels'
                selections={this.props.selectedModels}/>
              {this.renderStepActions(2, (this.props.selectedModels.length == 0 ? true : false), 'selectedModels', this.props._runSelectedModels)}
            </StepContent>
          </Step>
          <Step>
            <StepLabel style={{color: this.state.stepIndex > 2 ? 'rgb(0, 188, 212)' : 'lightgrey'}}>Select Seed Model: {this.props.selectedSeedModel !== null ? this.props.selectedSeedModel.substr(this.props.selectedSeedModel.indexOf('('), this.props.selectedSeedModel.length): ''}</StepLabel>
            <StepContent>
              {this.props.table == undefined ?
                <div style={{color: 'lightgrey'}}>
                  <CircularProgress />
                  Building Models...
                </div>:
                <div>
                  <p>
                    <span style={{color: 'rgba(255, 0, 255, 1)'}}>{this.props.bestSeedModelTag}</span> has the highest <span style={{color: 'rgba(255, 0, 255, 1)'}}>{this.props.table != undefined ? this.props.table.metrics[0]: ''} </span>
                    score of <span style={{color: 'rgba(255, 0, 255, 1)'}}>{this.props.bestSeedModelScore}. </span>
                    Please select this model or another as the seed to initiate ensemble creation.
                  </p>
                  <LongDropDownMenu
                    items={this.props.selectedModels}
                    _setAppState={this.props._setAppState}
                    selectedValue={this.props.selectedSeedModel}
                    selectionName='selectedSeedModel'/>
                  <SelectionTable
                    type='summary'
                    table={this.props.table}/>
                </div>
              }
              {this.renderStepActions(3, (this.props.selectedSeedModel == null ? true : false), 'selectedSeedModel' , this.props._getEnsembleSuggestions)}
            </StepContent>
          </Step>
          <Step>
            <StepLabel style={{color: this.state.stepIndex > 2 ? 'rgb(0, 188, 212)' : 'lightgrey'}}>Create Ensemble: {this.props.selectedEnsembleModels.length > 0 ? this.props.selectedEnsembleModels.length.toString() + ' Models' : ''} </StepLabel>
            <StepContent>
            {this.props.correlation == undefined ?
              <div style={{color: 'lightgrey'}}>
                <CircularProgress />
                Building Models...
              </div>:
              <div>
                <p>
                  Enigma has found the 4 most Jaccardian disimilar models to <span style={{color: 'rgba(255, 0, 255, 1)'}}>{this.props.selectedSeedModel} </span>
                  in order to attempt to prevent correlation among model predictions.
                  Please select low correlated models, less than 75%, to create the stacked ensemble.
                </p>
                <MultiDropDown
                  _setAppState={this.props._setAppState}
                  _updateAppState={this.props._updateAppState}
                  label='Ensemble Models'
                  items={this.props.correlation.modelNames}
                  selectionName='selectedEnsembleModels'
                  selections={this.props.selectedEnsembleModels}/>
                <SelectionTable
                  type='correlation'
                  table={this.props.correlation}/>
              </div>
            }
            {this.renderStepActions(4, (this.props.selectedEnsembleModels.length == 0 ? true : false), 'selectedEnsembleModels', this.props._createStackedEnsemble)}
            </StepContent>
          </Step>
          <Step>
            <StepLabel style={{color: this.state.stepIndex > 3 ? 'rgb(0, 188, 212)' : 'lightgrey'}}>Predict New Observations</StepLabel>
            <StepContent>
              {this.props.stacked == undefined ?
                <div style={{color: 'lightgrey'}}>
                  <CircularProgress />
                  Building Ensemble...
                </div>:
                <div>
                  <p>
                    The final stacked model has an overall <span style={{color: 'rgba(255, 0, 255, 1)'}}>{this.props.stackedstats}</span> of <span style={{color: 'rgba(255, 0, 255, 1)'}}>{this.props.predictionType}.</span>
                    Please input or upload new observations for the model to predict.
                  </p>
                  <SelectionTable
                    type='summary'
                    table={this.props.stackedstats}/>
                </div>
              }
              {this.renderStepActions(5, (this.props.selectedModel == null ? true : false), '' , this.props._getPredictions)}
            </StepContent>
          </Step>
        </Stepper>
        {finished && (
          <p style={{margin: '20px 0', textAlign: 'center'}}>
          <a
          href="#"
          onClick={(event) => {
            event.preventDefault();
            this.setState({stepIndex: 0, finished: false});
          }}
          >
          Click here
          </a> to reset the example.
          </p>
        )}
      </div>
    );
  }
  componentDidMount () {
  }
}

export default ProgressStepper;

// <Step>
//   <StepLabel style={{color: this.state.stepIndex > 1 ? 'rgb(0, 188, 212)' : 'lightgrey'}}>Create Ensemble</StepLabel>
//   <StepContent>
//     <p>
//     </p>
//     <LongDropDownMenu
//       items={this.props.suggestedModels.sort()}
//       _setAppState={this.props._setAppState}
//       selectedValue={this.props.selectedModel}
//       selectionName='selectedModel'/>
//     {this.renderStepActions(4, (this.props.selectedModel == null ? true : false), 'selectedModel', this.props._runSelectedModels)}
//   </StepContent>
// </Step>
// <Step>
//   <StepLabel style={{color: this.state.stepIndex > 1 ? 'rgb(0, 188, 212)' : 'lightgrey'}}>Predict New Observations</StepLabel>
//   <StepContent>
//     <p>
//       Prediction column requires <span style={{color: 'rgba(255, 0, 255, 1)'}}>{this.props.predictionType}.</span> Data is __ distributed.
//       There are <span style={{color: 'rgba(255, 0, 255, 1)'}}>{this.props.observationCount}</span> observations. Please select an suggested model based on these parameters.
//     </p>
//     <LongDropDownMenu
//       items={this.props.suggestedModels.sort()}
//       _setAppState={this.props._setAppState}
//       selectedValue={this.props.selectedModel}
//       selectionName='selectedModel'/>
//     {this.renderStepActions(5, (this.props.selectedModel == null ? true : false), 'selectedModel', this.props._runSelectedModels)}
//   </StepContent>
// </Step>
