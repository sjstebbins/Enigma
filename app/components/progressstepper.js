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
import StatsTable from './statstable.js'

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
      finished: stepIndex >= 5,
    });
    if (onClickFunction == null) {return}
    if (selection == 'selectedSeedModel') {
      onClickFunction(this.props[selection], this.props.selectedColumn, this.props.predictionType, this.props.predictionClass)
      return
    }
    if (selection == 'selectedEnsembleModels') {
      onClickFunction(this.props[selection], this.props.selectedColumn)
      return
    }
    var args = null
    if (selection == 'selectedModels') {
      args = this.props['selectedColumn']
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
        {this.state.finished ?
          <RaisedButton
            label="Reset Enigma"
            primary={true}
            onTouchTap={(event) => {
              event.preventDefault();
              this.props._resetState()
              this.setState({stepIndex: 0, finished: false});
            }}
            style={{marginRight: 12}}
          />:
          <RaisedButton
            id='next'
            label={stepIndex === 6 ? 'Finish' : 'Next'}
            disabled={hold}
            primary={true}
            onTouchTap={this.handleNext.bind(this, selection, onClickFunction)}
            style={{marginRight: 12}}
          />
        }
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


  // <DataTable
  //   items={this.props.columns}
  //   selectedDataset={this.props.selectedDataset}/>

  componentWillReceiveProps (nextProps) {
    if (this.props.table != nextProps.table && nextProps.table != undefined) {
      var means = nextProps.table.models.map( (item, i) => {
        return nextProps.table[nextProps.table.metrics[1]][i][3]
      })
      var bestSeedModelScore = null
      nextProps.predictionType == 'Regression' ? bestSeedModelScore = Math.max.apply(null, means) :  bestSeedModelScore = Math.max.apply(null, means)
      var bestSeedModelTag = nextProps.table.models[means.indexOf(bestSeedModelScore)]
      var selectedSeedModel = nextProps.selectedModels[means.indexOf(bestSeedModelScore)]
      nextProps._setAppState({selectedSeedModel: selectedSeedModel})
      nextProps._setAppState({bestSeedModelTag: bestSeedModelTag})
      nextProps._setAppState({bestSeedModelScore: bestSeedModelScore})
    }
  }
  render() {
    const {finished, stepIndex} = this.state;

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
              <p>Welcome to Enigma. Please upload a dataset or select a sample dataset.</p>
              <FlatButton
              disabled={true}
              onClick={ () => {this.props._setAppState({selectedDataset: ''})}}
              label="Upload Train Data"
              backgroundColor='rgba(229, 229, 229, .4)'
              icon={<FontIcon className="muidocs-icon-file-upload" />}/>
              <LongDropDownMenu
                label='Sample Datasets'
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
            <StepLabel style={{color: this.state.stepIndex > 1 ? 'rgb(0, 188, 212)' : 'lightgrey'}}>Try Seed Models: {this._step2Label()} </StepLabel>
            <StepContent>
              <p>
                Prediction column requires <span style={{color: 'rgba(255, 0, 255, 1)'}}> {this.props.predictionType} </span> to predict <span style={{color: 'rgba(255, 0, 255, 1)'}}>{this.props.predictionClass} </span> target values.
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
                    <span style={{color: 'rgba(255, 0, 255, 1)'}}>{this.props.bestSeedModelTag}</span> has the highest <span style={{color: 'rgba(255, 0, 255, 1)'}}>{this.props.table != undefined ? this.props.table.metrics[1]: ''} </span>
                    score of <span style={{color: 'rgba(255, 0, 255, 1)'}}>{this.props.bestSeedModelScore}. </span>
                    Please select this model or another as the seed to initiate ensemble creation.
                  </p>
                  <LongDropDownMenu
                    items={this.props.selectedModels}
                    _setAppState={this.props._setAppState}
                    selectedValue={this.props.selectedSeedModel}
                    selectionName='selectedSeedModel'/>
                  <StatsTable
                    type='summary'
                    table={this.props.table}/>
                </div>
              }
              {this.renderStepActions(3, (this.props.selectedSeedModel == null ? true : false), 'selectedSeedModel' , this.props._getEnsembleSuggestions)}
            </StepContent>
          </Step>
          <Step>
            <StepLabel style={{color: this.state.stepIndex > 3 ? 'rgb(0, 188, 212)' : 'lightgrey'}}>Select Ensemble Models: {this.props.selectedEnsembleModels.length > 0 ? this.props.selectedEnsembleModels.length.toString() + ' Models' : ''} </StepLabel>
            <StepContent>
            {this.props.correlation == undefined ?
              <div style={{color: 'lightgrey'}}>
                <CircularProgress />
                Fetching Suggestions...
              </div>:
              <div>
                <p>
                  Enigma has found the 4 most Jaccardian disimilar models to <span style={{color: 'rgba(255, 0, 255, 1)'}}>{this.props.selectedSeedModel} </span>
                  to attempt to prevent correlation among model predictions. Enigma has preselected models with complete correlation less than 75%.
                  Please confirm or edit these selections to create the stacked ensemble.
                </p>
                <MultiDropDown
                  _setAppState={this.props._setAppState}
                  _updateAppState={this.props._updateAppState}
                  label='Ensemble Models'
                  items={this.props.correlation.modelNames}
                  selectionName='selectedEnsembleModels'
                  selections={this.props.selectedEnsembleModels}/>
                <StatsTable
                  type='correlation'
                  table={this.props.correlation}/>
              </div>
            }
            {this.renderStepActions(4, (this.props.selectedEnsembleModels.length == 0 ? true : false), 'selectedEnsembleModels', this.props._createStackedEnsemble)}
            </StepContent>
          </Step>
          <Step>
            <StepLabel style={{color: this.state.stepIndex > 4 ? 'rgb(0, 188, 212)' : 'lightgrey'}}>Choose Final Model: {this.props.selectedFinalModel !== null ? this.props.selectedFinalModel: ''}</StepLabel>
            <StepContent>
            {this.props.stackedstats == undefined ?
              <div style={{color: 'lightgrey'}}>
                <CircularProgress />
                Building Ensemble...
              </div>:
              <div>
                <p>
                  The stacked ensemble has a <span style={{color: 'rgba(255, 0, 255, 1)'}}>{this.props.stackedstats.columns[2]}</span> score of <span style={{color: 'rgba(255, 0, 255, 1)'}}>{this.props.stackedstats.stats[2]}, </span>
                  which is <span style={{color: 'rgba(255, 0, 255, 1)'}}>{(this.props.stackedstats.stats[2] - this.props.bestSeedModelScore).toFixed(2)} {this.props.stackedstats.stats[2] > this.props.bestSeedModelScore ? 'greater': 'less'} </span> than <span style={{color: 'rgba(255, 0, 255, 1)'}}>{this.props.bestSeedModelTag}'s </span> score.
                  Please choose the best seed model or the stacked ensemble. Enigma has preselected the model with the best <span style={{color: 'rgba(255, 0, 255, 1)'}}>{this.props.stackedstats.columns[2]} </span> score.
                </p>
                <LongDropDownMenu
                  items={[this.props.bestSeedModelTag,'Stacked Ensemble Model']}
                  _setAppState={this.props._setAppState}
                  selectedValue={this.props.selectedFinalModel}
                  selectionName='selectedFinalModel'/>
                <StatsTable
                  type='stackedstats'
                  table={this.props.stackedstats}/>
              </div>
            }
            {this.renderStepActions(5, (this.props.selectedFinalModel == null ? true : false), 'selectedFinalModel' , null)}
            </StepContent>
          </Step>
          <Step>
            <StepLabel style={{color: this.state.stepIndex > 4 ? 'rgb(0, 188, 212)' : 'lightgrey'}}>Predict New Observations:</StepLabel>
            <StepContent>
            {this.props.stackedstats != null ?
              <div>
                <p>Predict <span style={{color: 'rgba(255, 0, 255, 1)'}}>{this.props.selectedColumn}</span> for uploaded or inputed observations.</p>
                <FlatButton
                  disabled={true}
                  label="Upload Test Data"
                  backgroundColor='rgba(229, 229, 229, .4)'
                  icon={<FontIcon className="muidocs-icon-file-upload" />}>
                  <input id='uploadTest' type="file" style={styles.exampleImageInput} />
                </FlatButton>
                <TextField
                  id='newobservation'
                  multiLine={true}
                  rows={3}
                  rowsMax={100}
                  onChange={(event) => {
                    this.setState({prediction: event.target.value})
                  }}
                  floatingLabelStyle={{color: 'rgb(0, 188, 212)'}}
                  textareaStyle={{color: 'white'}}
                  inputStyle={{color: 'white !important'}}
                  hintStyle={{color: 'lightgrey'}}
                  hintText='Example: [{"Sepal.Length": 5,"Sepal.Width": 3,	"Petal.Length": 2, "Petal.Width": .3}]'
                  floatingLabelText="Input Observation"
                 />
                 <RaisedButton
                   label={"Predict "  + this.props.selectedColumn}
                   onClick={this.props._getPredictions.bind(this, this.props.selectedEnsembleModels, this.props.selectedColumn, this.state.prediction, 'input', this.props.selectedFinalModel)}
                   secondary={true}>
                 </RaisedButton>
                 <p>{this.props.predictions !== undefined ? this.props.predicions: ''}</p>
                {this.props.predicitons == undefined ?
                  <div/>:
                  <StatsTable
                    type='prediction'
                    target={this.props.selectedColumn}
                    observations={this.props.observations}
                    predictions={this.props.predictions}/>
                }
              </div>:
              <div/>}
            {this.renderStepActions(6, (this.state.stepIndex == 6 ? true : false), 'selectedFinalModel' , this.props._getPredictions)}
            </StepContent>
          </Step>
        </Stepper>
      </div>
    );
  }
  _step2Label = () => {
    if (this.props.selectedModels) {
      return this.props.selectedModels.length < 2 ? this.props.selectedModels[0]: this.props.selectedModels.length.toString() + ' Models'
    }
  }
  componentDidMount () {

  }
}

export default ProgressStepper;
