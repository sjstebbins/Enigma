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

// custom components
import LongDropDownMenu from './dropdown.js'
import DataTable from './datatable.js'


/**
 * A contrived example using a transition between steps
 */


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
        stepIndex: 0,
      }
  }
  handleNext = () => {
    const {stepIndex} = this.state;
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 2,
    });
  };

  handlePrev = (selection) => {
    const {stepIndex} = this.state;
    if (stepIndex > 0) {
      this.props._setAppState({[selection]: null})
      this.setState({stepIndex: stepIndex - 1});
    }
  };
  renderStepActions(step, hold, selection) {
    const {stepIndex} = this.state;

    return (
      <div style={{margin: '12px 0', color: 'white'}}>
        <RaisedButton
          label={stepIndex === 2 ? 'Finish' : 'Next'}
          disabled={hold}
          primary={true}
          onTouchTap={this.handleNext}
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
              <p>Welcome to Enigma. Please upload a dataset or select a sample data.</p>
              <form encType="multipart/form-data" action="/post_data" method="post">

              </form>
              <LongDropDownMenu
                items={this.props.sampleDatasets.sort()}
                _setAppState={this.props._setAppState}
                selectedValue={this.props.selectedDataset}
                selectionName='selectedDataset'
                selectionFunction={this.props._getSampleData}/>
              {this.renderStepActions(0, (this.props.selectedDataset == null ? true : false), 'selectedDataset')}
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
                selectionName='selectedColumn'
                selectionFunction={this.props._getModels}  />
              {this.renderStepActions(1, (this.props.selectedColumn == null ? true : false), 'selectedColumn')}
            </StepContent>
          </Step>
          <Step>
            <StepLabel style={{color: this.state.stepIndex > 1 ? 'rgb(0, 188, 212)' : 'lightgrey'}}>Select Model</StepLabel>
            <StepContent>
              <p>
                You have selected ___ and thus are performing a ___ prediction. Please select an initial model based on these parameters.
              </p>
              <LongDropDownMenu
                items={this.props.models.sort()}
                _setAppState={this.props._setAppState}
                selectedValue={this.props.selectedModel}
                selectionName='selectedModel'
                selectionFunction={this.props._getModels}  />
              {this.renderStepActions(2, (this.props.selectedModel == null ? true : false), 'selectedModel')}
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
