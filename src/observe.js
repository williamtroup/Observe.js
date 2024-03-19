/**
 * Observe.js
 * 
 * A lightweight JavaScript library that allows developers to keep track of changes to JavaScript objects and/or DOM elements.
 * 
 * @file        observe.js
 * @version     v0.8.1
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


( function() {
    var // Variables: Constructor Parameters
        _parameter_Document = null,
        _parameter_Window = null,
        _parameter_Math = null,
        _parameter_Json = null,

        // Variables: Strings
        _string = {
            empty: ""
        },

        // Variables: Watches
        _watches = {},
        _watches_Cancel = false,

        // Variables: Configuration
        _configuration = {},

        // Variables: Attribute Names
        _attribute_Name_Watch_Options = "data-observe-watch-options";


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

        if ( isDefined( element ) && element.hasAttribute( _attribute_Name_Watch_Options ) ) {
            var bindingOptionsData = element.getAttribute( _attribute_Name_Watch_Options );

            if ( isDefinedString( bindingOptionsData ) ) {
                var bindingOptions = getObjectFromString( bindingOptionsData );

                if ( bindingOptions.parsed && isDefinedObject( bindingOptions.result ) ) {
                    bindingOptions = getWatchOptions( bindingOptions.result );

                    if ( !isDefinedString( element.id ) ) {
                        element.id = newGuid();
                    }

                    if ( bindingOptions.removeAttribute ) {
                        element.removeAttribute( _attribute_Name_Watch_Options );
                    }

                    createWatch( element, bindingOptions, element.id );

                } else {
                    logError( _configuration.attributeNotValidErrorText.replace( "{{attribute_name}}", _attribute_Name_Watch_Options ) );
                    result = false;
                }

            } else {
                logError( _configuration.attributeNotSetErrorText.replace( "{{attribute_name}}", _attribute_Name_Watch_Options ) );
                result = false;
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
                watch = {},
                startWatchObject;

            watch.options = watchOptions;
            watch.totalChanges = 0;

            if ( isDefinedString( domElementId ) ) {
                var domElement = _parameter_Document.getElementById( domElementId );

                if ( isDefined( domElement ) ) {
                    watch.domElementId = domElementId;
                    watch.cachedObject = domElement.outerHTML;
                    watch.originalObject = domElement.outerHTML;

                    startWatchObject = domElement.outerHTML;
                }

            } else {
                watch.cachedObject = _parameter_Json.stringify( object );
                watch.originalObject = object;

                startWatchObject = object;
            }

            if ( isDefined( watch.cachedObject ) ) {
                fireCustomTrigger( watch.options.onStart, startWatchObject );

                watch.timer = setInterval( function() {
                    watchTimer( watchOptions, storageId );
                }, watchOptions.timeout );
    
                _watches[ storageId ] = watch;
            }
        }

        return storageId;
    }

    function watchTimer( watchOptions, storageId ) {
        var currentDateTime = new Date();

        if ( !isDefinedDate( watchOptions.starts ) || currentDateTime >= watchOptions.starts ) {
            watchObjectForChanges( storageId );

            if ( isDefinedDate( watchOptions.expires ) && currentDateTime >= watchOptions.expires ) {
                cancelWatchObject( storageId );
            }
        }
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
                } else {
                    watch.originalObject = _string.empty;

                    fireCustomTrigger( watch.options.onRemove, watch.domElementId );
                }
            }

            var cachedObject = watch.cachedObject,
                originalObject = watch.originalObject,
                originalObjectJson = !isDomElement ? _parameter_Json.stringify( originalObject ) : originalObject;

            if ( cachedObject !== originalObjectJson ) {
                if ( watch.options.reset ) {
                    if ( isDomElement ) {
                        domElement.outerHTML = watch.cachedObject;
                    } else {
                        watch.originalObject = getObjectFromString( cachedObject ).result;
                    }

                } else {
                    watch.cachedObject = originalObjectJson;
                }

                if ( isDomElement ) {
                    fireCustomTrigger( watch.options.onChange, cachedObject, originalObjectJson );
                } else {

                    var oldValue = getObjectFromString( cachedObject ).result,
                        newValue = getObjectFromString( originalObjectJson ).result;

                    if ( !isDefinedArray( oldValue ) && !isDefinedArray( newValue ) ) {
                        compareWatchObject( oldValue, newValue, watch );

                        if ( isDefinedFunction( watch.options.onPropertyChange ) ) {
                            compareWatchObjectProperties( oldValue, newValue, watch );
                        }
                        
                    } else {
                        fireCustomTrigger( watch.options.onChange, oldValue, newValue );
                    }
                }

                watch.totalChanges++;

                if ( watch.options.pauseTimeoutOnChange > 0 ) {
                    pauseWatchObject( storageId, watch.options.pauseTimeoutOnChange );
                }

                if ( watch.options.cancelOnChange ) {
                    cancelWatchObject( storageId );
                }

                if ( watch.options.maximumChangesBeforeCanceling > 0 && watch.totalChanges >= watch.options.maximumChangesBeforeCanceling ) {
                    cancelWatchObject( storageId );
                }
            }
        }
    }

    function compareWatchObject( oldObject, newObject, watch ) {
        if ( isDefinedArray( watch.options.propertyNames ) ) {
            var propertyNamesLength = watch.options.propertyNames.length;

            for ( var propertyNameIndex = 0; propertyNameIndex < propertyNamesLength; propertyNameIndex++ ) {
                var propertyName = watch.options.propertyNames[ propertyNameIndex ];

                if ( oldObject[ propertyName ] !== newObject[ propertyName ] ) {
                    fireCustomTrigger( watch.options.onChange, oldObject, newObject );
                    break;
                }
            }

        } else {
            fireCustomTrigger( watch.options.onChange, oldObject, newObject );
        }
    }

    function compareWatchObjectProperties( oldObject, newObject, watch ) {
        for ( var propertyName in oldObject ) {
            if ( oldObject.hasOwnProperty( propertyName ) ) {
                var propertyOldValue = oldObject[ propertyName ],
                    propertyNewValue = null;

                if ( newObject.hasOwnProperty( propertyName ) ) {
                    propertyNewValue = newObject[ propertyName ];
                }

                if ( isDefinedObject( propertyOldValue ) && isDefinedObject( propertyNewValue ) ) {
                    compareWatchObjectProperties( propertyOldValue, propertyNewValue, watch.options );
                } else {

                    if ( !isDefinedArray( watch.options.propertyNames ) || watch.options.propertyNames.indexOf( propertyName ) > -1 ) {
                        if ( _parameter_Json.stringify( propertyOldValue ) !== _parameter_Json.stringify( propertyNewValue ) ) {
                            fireCustomTrigger( watch.options.onPropertyChange, propertyName, propertyOldValue, propertyNewValue );
                        }
                    }
                }
            }
        }
    }

    function cancelWatchesForObjects() {
        for ( var storageId in _watches ) {
            if ( _watches.hasOwnProperty( storageId ) ) {
                cancelWatchObject( storageId );
            }
        }
    }

    function cancelWatchObject( storageId ) {
        if ( _watches.hasOwnProperty( storageId ) ) {
            var watchOptions = _watches[ storageId ].options;

            if ( watchOptions.allowCanceling || _watches_Cancel ) {
                fireCustomTrigger( watchOptions.onCancel, storageId );
                clearInterval( _watches[ storageId ].timer );
                
                delete _watches[ storageId ];
            }
        }
    }

    function pauseWatchObject( storageId, milliseconds ) {
        var result = false;

        if ( _watches.hasOwnProperty( storageId ) ) {
            var watchOptions = _watches[ storageId ].options;

            if ( watchOptions.allowPausing ) {
                watchOptions.starts = new Date();
                watchOptions.starts.setMilliseconds( watchOptions.starts.getMilliseconds() + milliseconds );
    
                result = true;
            }
        }

        return result;
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Watch Options
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function getWatchOptions( newOptions ) {
        var options = getDefaultObject( newOptions, {} );

        options.timeout = getDefaultNumber( options.timeout, 250 );
        options.starts = getDefaultDate( options.starts, null );
        options.expires = getDefaultDate( options.expires, null );
        options.reset = getDefaultBoolean( options.reset, false );
        options.cancelOnChange = getDefaultBoolean( options.cancelOnChange, false );
        options.maximumChangesBeforeCanceling = getDefaultNumber( options.maximumChangesBeforeCanceling, 0 );
        options.pauseTimeoutOnChange = getDefaultNumber( options.pauseTimeoutOnChange, 0 );
        options.propertyNames = getDefaultArray( options.propertyNames, null );
        options.allowCanceling = getDefaultBoolean( options.allowCanceling, true );
        options.allowPausing = getDefaultBoolean( options.allowPausing, true );
        options.removeAttribute = getDefaultBoolean( options.removeAttribute, true );

        options = getWatchOptionsCustomTriggers( options );

        return options;
    }

    function getWatchOptionsCustomTriggers( options ) {
        options.onChange = getDefaultFunction( options.onChange, null );
        options.onPropertyChange = getDefaultFunction( options.onPropertyChange, null );
        options.onCancel = getDefaultFunction( options.onCancel, null );
        options.onRemove = getDefaultFunction( options.onRemove, null );
        options.onStart = getDefaultFunction( options.onStart, null );

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

            var character = _parameter_Math.floor( _parameter_Math.random() * 16 ).toString( 16 );
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

    function getDefaultString( value, defaultValue ) {
        return isDefinedString( value ) ? value : defaultValue;
    }

    function getDefaultDate( value, defaultValue ) {
        return isDefinedDate( value ) ? value : defaultValue;
    }

    function getDefaultArray( value, defaultValue ) {
        return isDefinedArray( value ) ? value : defaultValue;
    }

    function getDefaultObject( value, defaultValue ) {
        return isDefinedObject( value ) ? value : defaultValue;
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
                result = _parameter_Json.parse( objectString );
            }

        } catch ( e1 ) {

            try {
                result = eval( "(" + objectString + ")" );

                if ( isDefinedFunction( result ) ) {
                    result = result();
                }
                
            } catch ( e2 ) {
                parsed = logError( _configuration.objectErrorText.replace( "{{error_1}}",  e1.message ).replace( "{{error_2}}", e2.message ) );
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
     * watch().
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
    this.watch = function( object, options ) {
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
     * @returns     {boolean}                                               States if the object being watched has been cancelled.
     */
    this.cancelWatch = function( id ) {
        var result = false;

        if ( isDefinedString( id ) ) {
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
        }

        return result;
    };

    /**
     * cancelWatches().
     * 
     * Cancels all the watches currently running, or paused.
     * 
     * @public
     * 
     * @returns     {Object}                                                The Observe.js class instance.
     */
    this.cancelWatches = function() {
        cancelWatchesForObjects();

        return this;
    };

    /**
     * getWatch().
     * 
     * Returns the properties for a running, or paused, watch.
     * 
     * @public
     * 
     * @param       {string}    id                                          The Id of the object being watched, or DOM element ID being watched.
     * 
     * @returns     {Object}                                                The watch properties for an object (null if not found).
     */
    this.getWatch = function( id ) {
        var result = null;

        if ( isDefinedString( id ) ) {
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
        }

        return result;
    };

    /**
     * getWatches().
     * 
     * Returns all the watches currently running, or paused.
     * 
     * @public
     * 
     * @returns     {Object}                                                The object of watches currently running, or paused.
     */
    this.getWatches = function() {
        return _watches;
    };

    /**
     * pauseWatch().
     * 
     * Pauses the watching of an object for changes for a specific number of milliseconds.
     * 
     * @public
     * 
     * @param       {string}    id                                          The Id of the object being watched, or DOM element ID being watched.
     * @param       {number}    milliseconds                                The milliseconds to pause the watch for.
     * 
     * @returns     {boolean}                                               States if the object being watched has been paused.
     */
    this.pauseWatch = function( id, milliseconds ) {
        var result = false;

        if ( isDefinedString( id ) && isDefinedNumber( milliseconds ) ) {
            if ( _watches.hasOwnProperty( id ) ) {
                result = pauseWatchObject( id, milliseconds );
            } else {
    
                for ( var storageId in _watches ) {
                    if ( _watches.hasOwnProperty( storageId ) && isDefinedString( _watches[ storageId ].domElementId ) && _watches[ storageId ].domElementId === id ) {
                        result = pauseWatchObject( storageId, milliseconds );
                        break;
                    }
                }
            }
        }

        return result;
    };

    /**
     * pauseWatches().
     * 
     * Pauses all the watches for a specific number of milliseconds.
     * 
     * @public
     * 
     * @param       {number}    milliseconds                                The milliseconds to pause the watches for.
     * 
     * @returns     {Object}                                                The Observe.js class instance.
     */
    this.pauseWatches = function( milliseconds ) {
        if ( isDefinedNumber( milliseconds ) ) {
            for ( var storageId in _watches ) {
                if ( _watches.hasOwnProperty( storageId ) ) {
                    pauseWatchObject( storageId, milliseconds );
                }
            }
        }

        return this;
    };

    /**
     * resumeWatch().
     * 
     * Resumes the watching of an object for changes after it was paused.
     * 
     * @public
     * 
     * @param       {string}    id                                          The Id of the object being watched, or DOM element ID being watched.
     * 
     * @returns     {boolean}                                               States if the watching of an object has been resumed
     */
    this.resumeWatch = function( id ) {
        var result = false;

        if ( isDefinedString( id ) ) {
            if ( _watches.hasOwnProperty( id ) ) {
                _watches[ id ].options.starts = null;
                result = true;
            } else {
    
                for ( var storageId in _watches ) {
                    if ( _watches.hasOwnProperty( storageId ) && isDefinedString( _watches[ storageId ].domElementId ) && _watches[ storageId ].domElementId === id ) {
                        _watches[ storageId ].options.starts = null;
                        result = true;
                        break;
                    }
                }
            }
        }

        return result;
    };

    /**
     * resumeWatches().
     * 
     * Resumes all the watches that are currently paused.
     * 
     * @public
     * 
     * @returns     {Object}                                                The Observe.js class instance.
     */
    this.resumeWatches = function() {
        for ( var storageId in _watches ) {
            if ( _watches.hasOwnProperty( storageId ) ) {
                _watches[ storageId ].options.starts = null;
            }
        }

        return this;
    };

    /**
     * searchDomForNewWatches().
     * 
     * Searches the DOM for new elements to watch, and adds them.
     * 
     * @public
     * 
     * @returns     {Object}                                                The Observe.js class instance.
     */
    this.searchDomForNewWatches = function() {
        collectDOMObjects();

        return this;
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
    this.setConfiguration = function( newConfiguration ) {
        if ( isDefinedObject( newConfiguration ) ) {
            var configurationHasChanged = false;
        
            for ( var propertyName in newConfiguration ) {
                if ( newConfiguration.hasOwnProperty( propertyName ) && _configuration.hasOwnProperty( propertyName ) && _configuration[ propertyName ] !== newConfiguration[ propertyName ] ) {
                    _configuration[ propertyName ] = newConfiguration[ propertyName ];
                    configurationHasChanged = true;
                }
            }
    
            if ( configurationHasChanged ) {
                buildDefaultConfiguration( _configuration );
            }
        }

        return this;
    };

    function buildDefaultConfiguration( newConfiguration ) {
        _configuration = !isDefinedObject( newConfiguration ) ? {} : newConfiguration;
        _configuration.safeMode = getDefaultBoolean( _configuration.safeMode, true );
        _configuration.domElementTypes = getDefaultStringOrArray( _configuration.domElementTypes, [ "*" ] );

        buildDefaultConfigurationStrings();
    }

    function buildDefaultConfigurationStrings() {
        _configuration.objectErrorText = getDefaultString( _configuration.objectErrorText, "Errors in object: {{error_1}}, {{error_2}}" );
        _configuration.attributeNotValidErrorText = getDefaultString( _configuration.attributeNotValidErrorText, "The attribute '{{attribute_name}}' is not a valid object." );
        _configuration.attributeNotSetErrorText = getDefaultString( _configuration.attributeNotSetErrorText, "The attribute '{{attribute_name}}' has not been set correctly." );        
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
        return "0.8.1";
    };


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Initialize Observe.js
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    ( function ( documentObject, windowObject, mathObject, jsonObject ) {
        _parameter_Document = documentObject;
        _parameter_Window = windowObject;
        _parameter_Math = mathObject;
        _parameter_Json = jsonObject;

        buildDefaultConfiguration();

        _parameter_Document.addEventListener( "DOMContentLoaded", function() {
            collectDOMObjects();
        } );

        _parameter_Window.addEventListener( "pagehide", function() {
            _watches_Cancel = true;

            cancelWatchesForObjects();
        } );

        if ( !isDefined( _parameter_Window.$observe ) ) {
            _parameter_Window.$observe = this;
        }

    } ) ( document, window, Math, JSON );
} )();