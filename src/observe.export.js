/**
 * Observe.js
 * 
 * A lightweight JavaScript library that allows developers to keep track of changes to JavaScript objects and/or DOM elements.
 * 
 * @file        observe.js
 * @version     v0.8.2
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


var observe = {
    js: function() {
        return window.$observe;
    }
};

Object.assign( window, { observe } );

export { observe };