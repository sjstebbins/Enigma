
import React from 'react';
import Checkbox from 'material-ui/Checkbox';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import {List, ListItem, MakeSelectable} from 'material-ui/List';
import {Popover, PopoverAnimationVertical} from 'material-ui/Popover'
import IconButton from  'material-ui/IconButton'
import DropDownArrow from 'material-ui/svg-icons/navigation/arrow-drop-down.js'

let SelectableList = MakeSelectable(List);

export default class MultiDropDown extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      open: false
    }
  }
  handleTouchTap = (event) => {
    // This prevents ghost click.
    event.preventDefault();
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  updateSelectedItem = (item) => {
    this.props._updateAppState(this.props.selectionName, item)
  }

  render() {
    return (
      <div>
        <IconButton
          style={{minWidth: '80%', borderBottom: '1px solid lightgrey'}}
          onTouchTap={this.handleTouchTap}>
          <div>
            <p style={{
              fontSize: 16,
              color: 'lightblue',
              position: 'absolute',
              top: 5,
              left: 0}}>
              {this.props.label}
            </p>
            <DropDownArrow style={{position: 'absolute', right: 5, bottom: 5}} color='white'/>
          </div>
        </IconButton>
        <Popover
          style={{maxHeight: 350, maxWidth: 350}}
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'bottom'}}
          onRequestClose={this.handleRequestClose}
          animation={PopoverAnimationVertical}>
            <SelectableList defaultValue={0} style={{overflowY: 'scroll', maxHeight: 350, width: '100%'}}>
              {this.props.items.map( (item, i) => (
                    <ListItem
                      key={item}
                      value={item}
                      primaryText={item.substr(0, item.indexOf('('))}
                      secondaryText={item.substr(item.indexOf('('), item.length)}
                      style={{height: 40}}
                      leftCheckbox={<Checkbox checked={(this.props.selections.indexOf(item) != -1)}/>}
                      onClick={this.updateSelectedItem.bind(this, item)}/>
                ))}
            </SelectableList>
         </Popover>
       </div>
    );
  }
  // constructor(props) {
  //   super(props);
  //   this.state = {value: 0};
  // }
  // componentWillMount () {
  //   if (this.props.selectedValue !== null) {
  //     this.setState({value: this.props.items.indexOf(this.props.selectedValue)})
  //   }
  // }
  // componentWillReceiveProps (nextProps) {
  //   if (nextProps.selectedValue !== null) {
  //     this.setState({value: this.props.items.indexOf(nextProps.selectedValue)})
  //   }
  // }
  // selectItem = (i, items) => {
  //   this.setState({value: i});
  //   this.props._setAppState({[this.props.selectionName]: items})
  // }
  // render() {
  //   String.prototype.trunc = String.prototype.trunc || function(n){
  //         return this.length>n ? this.substr(0,n-1)+'...' : this;
  //   };
  //   var ListItems = [];
  //   if (this.props.checkboxes == undefined) {
  //     ListItems = this.props.items.map( (item, i) => (
  //       <ListItem
  //         value={i}
  //         key={i}
  //         primaryText={item}
  //         label={item.trunc(25)}
  //         style={{height: 40}}
  //         onTouchTap={this.selectItem.bind(this, i, item)}/>
  //     ))
  //   } else {
  //     ListItems = this.props.items.map( (item, i) => (
  //       <ListItem
  //         value={i}
  //         key={i}
  //         primaryText={item.substr(0, item.indexOf('('))}
  //         secondaryText={item.substr(item.indexOf('('), item.length)}
  //         label={item.trunc(25)}
  //         style={{height: 40}}
  //         leftCheckbox={<Checkbox />}
  //         onTouchTap={this.selectItem.bind(this, i,item)}/>
  //     ))
  //   }
  //   // <DropDownMenu
  //   // maxHeight={300}
  //   // value={this.state.value}
  //   // onChange={this.selectItem}
  //   // underlineStyle={{marginLeft: 0}}
  //   // labelStyle={{paddingLeft: 0, color: 'lightblue'}}>
  //   return (
  //       <SelectField
  //         style={{width: '90%'}}
  //         labelStyle={{color: 'white'}}
  //         value={this.props.items[this.state.value]}>
  //         <List>
  //           {ListItems}
  //         </List>
  //       </SelectField>
  //   );
  //
  //   // </DropDownMenu>
  // }
}
