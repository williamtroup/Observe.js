/**
 * Observe.js
 * 
 * A lightweight, and easy-to-use, JavaScript library for observing any kind of JS object, or HTML DOM element.
 * 
 * @file        observe.js
 * @version     v0.1.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2023
 */


( function() {
    var // Variables: Constructor Parameters
        _parameter_Window = null,

        // Variables: Strings
        _string = {
            empty: ""
        },

        // Variables: Observables
        _observables = {},

        // Variables: Configuration
        _configuration = {};


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Observable Object Creation / Handling
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function createObservableObject( object, options ) {
        if ( isDefinedObject( object ) ) {
            var storageId = newGuid(),
                observeOptions = getObserveOptions( options );

            _observables[ storageId ] = {};
            _observables[ storageId ].cachedObject = JSON.stringify( object );
            _observables[ storageId ].originalObject = object;
            _observables[ storageId ].options = observeOptions;

            _observables[ storageId ].timer = setInterval( function() {
                var currentDateTime = new Date();

                observeObject( storageId );

                if ( isDefinedDate( observeOptions.expires ) && currentDateTime > observeOptions.expires ) {
                    clearTimeout( _observables[ storageId ].timer );
                    delete _observables[ storageId ];
                }

            }, observeOptions.observeTimeout );
        }
    }

    function observeObject( storageId ) {
        var cachedObject = _observables[ storageId ].cachedObject,
            originalObject = _observables[ storageId ].originalObject,
            originalObjectJson = JSON.stringify( originalObject );

        if ( cachedObject !== originalObjectJson ) {
            _observables[ storageId ].cachedObject = JSON.stringify( _observables[ storageId ].originalObject );

            var options = _observables[ storageId ].options,
                oldValue = getObjectFromString( cachedObject ).result,
                newValue = getObjectFromString( originalObjectJson ).result;

            fireCustomTrigger( options.onChange, oldValue, newValue );

            if ( isDefinedFunction( options.onPropertyChange ) && !isDefinedArray( oldValue ) ) {
                compareObservableObjectProperties( oldValue, newValue, options );
            }
        }
    }

    function compareObservableObjectProperties( oldObject, newObject, options ) {
        for ( var propertyName in oldObject ) {
            if ( oldObject.hasOwnProperty( propertyName ) ) {
                var propertyOldValue = oldObject[ propertyName ],
                    propertyNewValue = null;

                if ( newObject.hasOwnProperty( propertyName ) ) {
                    propertyNewValue = newObject[ propertyName ];
                }

                if ( isDefinedObject( propertyOldValue ) && isDefinedObject( propertyNewValue ) ) {
                    compareObservableObjectProperties( propertyOldValue, propertyNewValue, options );
                } else {

                    if ( JSON.stringify( propertyOldValue ) !== JSON.stringify( propertyNewValue ) ) {
                        fireCustomTrigger( options.onPropertyChange, propertyName, propertyOldValue, propertyNewValue );
                    }
                }
            }
        }
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Observe Options
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function getObserveOptions( newOptions ) {
        var options = !isDefinedObject( newOptions ) ? {} : newOptions;

        options.observeTimeout = getDefaultNumber( options.observeTimeout, 250 );
        options.expires = getDefaultDate( options.expires, null );
        options.onChange = getDefaultFunction( options.onChange, null );
        options.onPropertyChange = getDefaultFunction( options.onPropertyChange, null );

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
     * Public Functions:  Observables
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    /**
     * addObservableObject().
     * 
     * Adds an object that should be watched for changes.
     * 
     * @public
     * 
     * @param       {Object}    object                                      The object that should be watched. 
     * @param       {Object}    options                                     All the configuration options that should be used.
     * 
     * @returns     {Object}                                                The Observe.js class instance.
     */
    this.addObservableObject = function( object, options ) {
        createObservableObject( object, options );

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
    this.setConfiguration = function( newOptions ) {
        _configuration = !isDefinedObject( newOptions ) ? {} : newOptions;
        
        buildDefaultConfiguration();

        return this;
    };

    function buildDefaultConfiguration() {
        _configuration.safeMode = getDefaultBoolean( _configuration.safeMode, true );
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
        return "0.1.0";
    };


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Initialize Observe.js
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    ( function ( windowObject ) {
        _parameter_Window = windowObject;

        buildDefaultConfiguration();

        if ( !isDefined( _parameter_Window.$observe ) ) {
            _parameter_Window.$observe = this;
        }

    } ) ( window );
} )();