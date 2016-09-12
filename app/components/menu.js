'use strict';
//roboto font
// require('./assets/roboto.css');
// Material-UI
import $ from 'jquery'
// const ThemeManager = require('material-ui/lib/styles/theme-manager');
// const light = require('material-ui/lib/styles/raw-themes/light-raw-theme');
// const dark = require('material-ui/lib/styles/raw-themes/dark-raw-theme');
// import Colors from 'material-ui/src/styles/colors'

// App Dependencies
import React from "react";
var update = require('react-addons-update');
var ReactDOM = require('react-dom');

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import RaisedButton from 'material-ui/RaisedButton'
import Subheader from 'material-ui/Subheader'
// import FontIcon from 'material-ui/FontIcon';
// import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
// import MenuItem from 'material-ui/MenuItem';
// import DropDownMenu from 'material-ui/DropDownMenu';
// import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
// import ReactFireMixin from "reactfire";
// import Firebase from "firebase";
// import moment from 'moment';
// require('moment-timezone')
// import async from 'async'
// var $ = require('jquery');
// let assign = require('object-assign');
// import FirebaseUtilsMixin from "./utils/FirebaseUtilsMixin";
// import AppStateUtilsMixin from "./utils/AppStateUtilsMixin";
// var common = require('../common.js')
// var config = common.config();
//
// import firebase from './utils/firebase.js';
// firebase.init(config.firebaseUrl);



// Main app
var Menu = React.createClass({
    getInitialState () {
        return {
            //user state bound to firebase
            open: false,
        }
    },
    getDefaultProps () {
      return {

      }
    },
    componentWillMount () {

    },
    handleToggle () {
      this.setState({open: !this.state.open})
      this.get_ensemble()
    },
    handleClose () { this.setState({open: false}) },
    render () {
        return (
            <div>
              <AppBar
                title="Enigma"
                iconClassNameRight="muidocs-icon-navigation-expand-more"
                onLeftIconButtonTouchTap={this.handleToggle}
                style={{
                    margin: 0,
                    backgroundColor: 'rgba(0,0,0,0)',
                    position: 'fixed'
                }}>
                <Drawer
                  docked={false}
                  width={200}
                  open={this.state.open}
                  onRequestChange={(open) => this.setState({open})}
                  >
                  <Subheader>Menu</Subheader>
                  <MenuItem onTouchTap={this.handleClose}>Data</MenuItem>
                  <MenuItem onTouchTap={this.handleClose}>Algorithms</MenuItem>
                </Drawer>
              </AppBar>
            </div>
        )
    },
    get_ensemble () {
    },
    componentDidUpdate (prevProps, prevState) {
    },
    componentDidMount () {
    },
    componentWillUnmount () {
    },
});

export default Menu
