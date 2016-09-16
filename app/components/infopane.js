import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton'

export default class InfoPane extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillMount () {

  }
  componentWillReceiveProps (nextProps) {

  }
  createMarkup (html) { return {__html: html}; }
  render() {
    return (
      <Card style={{position: 'absolute', right: 30, top: 30, width: 350, backgroundColor: 'rgba(255,255,255,.1)', maxHeight: '90%', overflowY: 'scroll'}}>
        <CardText style={{color: 'white'}}>
          <div dangerouslySetInnerHTML={this.createMarkup(this.props.console.replace(/\r?\n/g, '<br/>'))} />
          <FlatButton label="Clear" style={{position: 'absolute', bottom: 10, right: 10}} onClick={this.clearConsole}/>
        </CardText>
      </Card>
    );
  }
  clearConsole = () => {
    this.props.setAppState({console: ''})
  }
}
