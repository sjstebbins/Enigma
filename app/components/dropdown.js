import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

export default class LongDropDownMenu extends React.Component {

  constructor(props) {
    super(props);
    this.state = {value: 0};
  }
  componentWillMount () {
    if (this.props.selectedValue !== null) {
      this.setState({value: this.props.items.indexOf(this.props.selectedValue)})
    }
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.selectedValue !== null) {
      this.setState({value: this.props.items.indexOf(nextProps.selectedValue)})
    }
  }
  handleChange = (event, index, value) => {
    this.setState({value});
    this.props._setAppState({[this.props.selectionName]: this.props.items[value]})
    this.props.selectionFunction(this.props.items[value])
  }
  render() {
    String.prototype.trunc = String.prototype.trunc || function(n){
          return this.length>n ? this.substr(0,n-1)+'...' : this;
    };
    return (
      <DropDownMenu
        maxHeight={300}
        value={this.state.value}
        onChange={this.handleChange}
        underlineStyle={{marginLeft: 0}}
        labelStyle={{paddingLeft: 0, color: 'lightblue'}}>
        {this.props.items.map( (item, i) => (
          <MenuItem value={i} key={i} primaryText={item} label={item.trunc(25)}/>
        ))}
      </DropDownMenu>
    );
  }
}
