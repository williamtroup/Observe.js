/**
 * Observe.js
 * 
 * A lightweight, and easy-to-use, JavaScript library for observing any kind of JS object, or HTML DOM element, to detect changes.
 * 
 * @file        observe.js
 * @version     v0.3.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2023
 */


( function() {
    var // Variables: Constructor Parameters
        _parameter_Document = null,
        _parameter_Window = null,

        // Variables: Strings
        _string = {
            empty: ""
        },

        // Variables: Watches
        _watches = {},

        // Variables: Configuration
        _configuration = {},

        // Variables: Attribute Names
        _attribute_Name_Options = "data-observe-options";


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Observable DOM Object Creation / Handling
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function collectDOMObjects() {
        var tagTypes = _configuration.domElementTypes,
            tagTypesLength = tagTypes.length;

        for ( var tagTypeIndex = 0; tagTypeIndex < tagTypesLength; tagTypeIndex++ ) {
            var domElements = _parameter_Document.getElementsByTagName( tagTypes[ tagTypeIndex ] ),
                elements = [].slice.call( domElements ),
                elementsLength = elements.length;

            for ( var elementIndex = 0; elementIndex < elementsLength; elementIndex++ ) {
                if ( !collectDOMObject( elements[ elementIndex ] ) ) {
                    break;
                }
            }
        }
    }

    function collectDOMObject( element ) {
        var result = true;

        if ( isDefined( element ) && element.hasAttribute( _attribute_Name_Options ) ) {
            var bindingOptionsData = element.getAttribute( _attribute_Name_Options );

            if ( isDefinedString( bindingOptionsData ) ) {
                var bindingOptions = getObjectFromString( bindingOptionsData );

                if ( bindingOptions.parsed && isDefinedObject( bindingOptions.result ) ) {
                    bindingOptions = getWatchOptions( bindingOptions.result );

                    if ( !isDefinedString( element.id ) ) {
                        element.id = newGuid();
                    }

                    createWatch( element, bindingOptions, element.id );

                } else {
                    if ( !_configuration.safeMode ) {
                        console.error( "The attribute '" + _attribute_Name_Options + "' is not a valid object." );
                        result = false;
                    }
                }

            } else {
                if ( !_configuration.safeMode ) {
                    console.error( "The attribute '" + _attribute_Name_Options + "' has not been set correctly." );
                    result = false;
                }
            }
        }

        return result;
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Watch Object Creation / Handling
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function createWatch( object, options, domElementId ) {
        var storageId = null;

        if ( isDefinedObject( object ) ) {
            storageId = newGuid();

            var watchOptions = getWatchOptions( options ),
                watch = {};

            watch.options = watchOptions;
            watch.domElementId = domElementId;
            watch.totalChanges = 0;

            if ( isDefinedString( domElementId ) ) {
                var domElement = _parameter_Document.getElementById( domElementId );

                if ( isDefined( domElement ) ) {
                    watch.cachedObject = domElement.outerHTML;
                    watch.originalObject = domElement.outerHTML;
                }

            } else {
                watch.cachedObject = JSON.stringify( object );
                watch.originalObject = object;
            }

            watch.timer = setInterval( function() {
                var currentDateTime = new Date();

                if ( !isDefinedDate( watchOptions.starts ) || currentDateTime >= watchOptions.starts ) {
                    watchObjectForChanges( storageId );

                    if ( isDefinedDate( watchOptions.expires ) && currentDateTime >= watchOptions.expires ) {
                        cancelWatchObject( storageId );
                    }
                }

            }, watchOptions.timeout );

            _watches[ storageId ] = watch;
        }

        return storageId;
    }

    function watchObjectForChanges( storageId ) {
        if ( _watches.hasOwnProperty( storageId ) ) {
            var watch = _watches[ storageId ],
                isDomElement = isDefinedString( watch.domElementId ),
                domElement = null;

            if ( isDomElement ) {
                domElement = _parameter_Document.getElementById( watch.domElementId );

                if ( isDefined( domElement ) ) {
                    watch.originalObject = domElement.outerHTML;
                }
            }

            var cachedObject = watch.cachedObject,
                originalObject = watch.originalObject,
                originalObjectJson = !isDomElement ? JSON.stringify( originalObject ) : originalObject;

            if ( cachedObject !== originalObjectJson ) {
                var watchOptions = watch.options;

                if ( watchOptions.reset ) {
                    if ( isDomElement ) {
                        domElement.outerHTML = watch.cachedObject;
                    } else {
                        watch.originalObject = getObjectFromString( cachedObject ).result;
                    }

                } else {
                    watch.cachedObject = originalObjectJson;
                }

                if ( isDomElement ) {
                    fireCustomTrigger( watchOptions.onChange, cachedObject, originalObjectJson );
                } else {

                    var oldValue = getObjectFromString( cachedObject ).result,
                        newValue = getObjectFromString( originalObjectJson ).result;

                    fireCustomTrigger( watchOptions.onChange, oldValue, newValue );

                    if ( isDefinedFunction( watchOptions.onPropertyChange ) && !isDefinedArray( oldValue ) ) {
                        compareWatchObjectProperties( oldValue, newValue, watchOptions );
                    }
                }

                if ( watchOptions.pauseTimeoutOnChange > 0 ) {
                    watchOptions.starts = new Date();
                    watchOptions.starts.setMilliseconds( watchOptions.starts.getMilliseconds() + watchOptions.pauseTimeoutOnChange );
                }

                if ( watchOptions.cancelOnChange ) {
                    cancelWatchObject( storageId );
                }

                watch.totalChanges++;

                if ( watchOptions.maximumChangesBeforeCanceling > 0 && watch.totalChanges >= watchOptions.maximumChangesBeforeCanceling ) {
                    cancelWatchObject( storageId );
                }
            }
        }
    }

    function compareWatchObjectProperties( oldObject, newObject, options ) {
        for ( var propertyName in oldObject ) {
            if ( oldObject.hasOwnProperty( propertyName ) ) {
                var propertyOldValue = oldObject[ propertyName ],
                    propertyNewValue = null;

                if ( newObject.hasOwnProperty( propertyName ) ) {
                    propertyNewValue = newObject[ propertyName ];
                }

                if ( isDefinedObject( propertyOldValue ) && isDefinedObject( propertyNewValue ) ) {
                    compareWatchObjectProperties( propertyOldValue, propertyNewValue, options );
                } else {

                    if ( JSON.stringify( propertyOldValue ) !== JSON.stringify( propertyNewValue ) ) {
                        fireCustomTrigger( options.onPropertyChange, propertyName, propertyOldValue, propertyNewValue );
                    }
                }
            }
        }
    }

    function cancelWatchObject( storageId ) {
        if ( _watches.hasOwnProperty( storageId ) ) {
            var watchOptions = _watches[ storageId ].options;

            fireCustomTrigger( watchOptions.onCancel, storageId );

            clearTimeout( _watches[ storageId ].timer );
            delete _watches[ storageId ];
        }
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Watch Options
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function getWatchOptions( newOptions ) {
        var options = !isDefinedObject( newOptions ) ? {} : newOptions;

        options.timeout = getDefaultNumber( options.timeout, 250 );
        options.starts = getDefaultDate( options.starts, null );
        options.expires = getDefaultDate( options.expires, null );
        options.reset = getDefaultBoolean( options.reset, false );
        options.cancelOnChange = getDefaultBoolean( options.cancelOnChange, false );
        options.maximumChangesBeforeCanceling = getDefaultNumber( options.maximumChangesBeforeCanceling, 0 );
        options.pauseTimeoutOnChange = getDefaultNumber( options.pauseTimeoutOnChange, 0 );

        options = getWatchOptionsCustomTriggers( options );

        return options;
    }

    function getWatchOptionsCustomTriggers( options ) {
        options.onChange = getDefaultFunction( options.onChange, null );
        options.onPropertyChange = getDefaultFunction( options.onPropertyChange, null );
        options.onCancel = getDefaultFunction( options.onCancel, null );

        return options;
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Triggering Custom Events
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function fireCustomTrigger( triggerFunction ) {
        if ( isDefinedFunction( triggerFunction ) ) {
            triggerFunction.apply( null, [].slice.call( arguments, 1 ) );
        }
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * String Handling
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function newGuid() {
        var result = [];

        for ( var charIndex = 0; charIndex < 32; charIndex++ ) {
            if ( charIndex === 8 || charIndex === 12 || charIndex === 16 || charIndex === 20 ) {
                result.push( "-" );
            }

            var character = Math.floor( Math.random() * 16 ).toString( 16 );
            result.push( character );
        }

        return result.join( _string.empty );
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Validation
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function isDefined( value ) {
        return value !== null && value !== undefined && value !== _string.empty;
    }

    function isDefinedObject( object ) {
        return isDefined( object ) && typeof object === "object";
    }

    function isDefinedBoolean( object ) {
        return isDefined( object ) && typeof object === "boolean";
    }

    function isDefinedString( object ) {
        return isDefined( object ) && typeof object === "string";
    }

    function isDefinedFunction( object ) {
        return isDefined( object ) && typeof object === "function";
    }

    function isDefinedNumber( object ) {
        return isDefined( object ) && typeof object === "number";
    }

    function isDefinedArray( object ) {
        return isDefinedObject( object ) && object instanceof Array;
    }

    function isDefinedDate( object ) {
        return isDefinedObject( object ) && object instanceof Date;
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Default Parameter/Option Handling
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function getDefaultBoolean( value, defaultValue ) {
        return isDefinedBoolean( value ) ? value : defaultValue;
    }

    function getDefaultFunction( value, defaultValue ) {
        return isDefinedFunction( value ) ? value : defaultValue;
    }

    function getDefaultNumber( value, defaultValue ) {
        return isDefinedNumber( value ) ? value : defaultValue;
    }

    function getDefaultDate( value, defaultValue ) {
        return isDefinedDate( value ) ? value : defaultValue;
    }

    function getDefaultArray( value, defaultValue ) {
        return isDefinedArray( value ) ? value : defaultValue;
    }

    function getDefaultStringOrArray( value, defaultValue ) {
        if ( isDefinedString( value ) ) {
            value = value.split( _string.space );

            if ( value.length === 0 ) {
                value = defaultValue;
            }

        } else {
            value = getDefaultArray( value, defaultValue );
        }

        return value;
    }

    function getObjectFromString( objectString ) {
        var parsed = true,
            result = null;

        try {
            if ( isDefinedString( objectString ) ) {
                result = JSON.parse( objectString );
            }

        } catch ( e1 ) {

            try {
                result = eval( "(" + objectString + ")" );

                if ( isDefinedFunction( result ) ) {
                    result = result();
                }
                
            } catch ( e2 ) {
                parsed = logError( "Errors in object: " + e1.message + ", " + e2.message );
                result = null;
            }
        }

        return {
            parsed: parsed,
            result: result
        };
    }

    function logError( error ) {
        var result = true;

        if ( !_configuration.safeMode ) {
            console.error( error );
            result = false;
        }

        return result;
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public Functions:  Watching Objects
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    /**
     * watchObject().
     * 
     * Adds an object that should be watched for changes.
     * 
     * @public
     * 
     * @param       {Object}    object                                      The object that should be watched. 
     * @param       {Object}    options                                     All the options that should be used.
     * 
     * @returns     {string}                                                The ID that object watch is stored under.
     */
    this.watchObject = function( object, options ) {
        return createWatch( object, options );
    };

    /**
     * cancelWatch().
     * 
     * Cancels the watching of an object for changes.
     * 
     * @public
     * 
     * @param       {string}    id                                          The Id of the object being watched, or DOM element ID being watched.
     * 
     * @returns     {boolean}                                               States if the object being watched has been canceled.
     */
    this.cancelWatch = function( id ) {
        var result = false;

        if ( _watches.hasOwnProperty( id ) ) {
            cancelWatchObject( id );

            result = true;
        } else {

            for ( var storageId in _watches ) {
                if ( _watches.hasOwnProperty( storageId ) && isDefinedString( _watches[ storageId ].domElementId ) && _watches[ storageId ].domElementId === id ) {
                    cancelWatchObject( storageId );
        
                    result = true;
                    break;
                }
            }
        }

        return result;
    };

    /**
     * cancelAllWatches().
     * 
     * Cancels all the watches currently running, or paused.
     * 
     * @public
     * 
     * @returns     {Object}                                                The Observe.js class instance.
     */
    this.cancelAllWatches = function() {
        for ( var storageId in _watches ) {
            if ( _watches.hasOwnProperty( storageId ) ) {
                cancelWatchObject( storageId );
            }
        }

        return this;
    };

    /**
     * getWatch().
     * 
     * Returns the properties for an active watch.
     * 
     * @public
     * 
     * @param       {string}    id                                          The Id of the object being watched, or DOM element ID being watched.
     * 
     * @returns     {Object}                                                The watch properties for an object (null if not found).
     */
    this.getWatch = function( id ) {
        var result = null;

        if ( _watches.hasOwnProperty( id ) ) {
            result = _watches[ id ];
        } else {

            for ( var storageId in _watches ) {
                if ( _watches.hasOwnProperty( storageId ) && isDefinedString( _watches[ storageId ].domElementId ) && _watches[ storageId ].domElementId === id ) {
                    result = _watches[ storageId ];
                    break;
                }
            }
        }

        return result;
    };


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public Functions:  Configuration
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    /**
     * setConfiguration().
     * 
     * Sets the specific configuration options that should be used.
     * 
     * @public
     * 
     * @param       {Options}   newConfiguration                            All the configuration options that should be set (refer to "Configuration/Options" documentation for properties).
     * 
     * @returns     {Object}                                                The Observe.js class instance.
     */
    this.setConfiguration = function( newOptions ) {
        _configuration = !isDefinedObject( newOptions ) ? {} : newOptions;
        
        buildDefaultConfiguration();

        return this;
    };

    function buildDefaultConfiguration() {
        _configuration.safeMode = getDefaultBoolean( _configuration.safeMode, true );
        _configuration.domElementTypes = getDefaultStringOrArray( _configuration.domElementTypes, [ "*" ] );
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public Functions:  Additional Data
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    /**
     * getVersion().
     * 
     * Returns the version of Observe.js.
     * 
     * @public
     * 
     * @returns     {string}                                                The version number.
     */
    this.getVersion = function() {
        return "0.3.0";
    };


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Initialize Observe.js
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    ( function ( documentObject, windowObject ) {
        _parameter_Document = documentObject;
        _parameter_Window = windowObject;

        buildDefaultConfiguration();

        _parameter_Document.addEventListener( "DOMContentLoaded", function() {
            collectDOMObjects();
        } );

        if ( !isDefined( _parameter_Window.$observe ) ) {
            _parameter_Window.$observe = this;
        }

    } ) ( document, window );
} )();