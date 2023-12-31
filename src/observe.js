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
        _compares = {},
        _observables = {},

        // Variables: Configuration
        _configuration = {};


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Compare Creation / Handling
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function createCompare( object1, object2, options ) {
        var storageId = newGuid(),
            compareOptions = getCompareOptions( options );

        _compares[ storageId ] = {};
        _compares[ storageId ].object1 = JSON.stringify( object1 );
        _compares[ storageId ].object2 = object2;
        _compares[ storageId ].options = compareOptions;

        _compares[ storageId ].timer = setInterval( function() {
            var currentDateTime = new Date();

            compareObject( storageId );

            if ( isDefinedDate( compareOptions.expires ) && currentDateTime > compareOptions.expires ) {
                clearTimeout( _compares[ storageId ].timer );
                delete _compares[ storageId ];
            }

        }, compareOptions.compareTimeout );
    }

    function compareObject( storageId ) {

    }


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

            if ( isDefinedFunction( options.onPropertyChange ) ) {
                for ( var propertyName in oldValue ) {
                    if ( oldValue.hasOwnProperty( propertyName ) ) {
                        var propertyOldValue = oldValue[ propertyName ],
                            propertyNewValue = null;

                        if ( newValue.hasOwnProperty( propertyName ) ) {
                            propertyNewValue = newValue[ propertyName ];
                        }

                        if ( JSON.stringify( propertyOldValue ) !== JSON.stringify( propertyNewValue ) ) {
                            fireCustomTrigger( options.onPropertyChange, propertyName, propertyOldValue, propertyNewValue );
                        }
                    }
                }
            }
        }
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Compare Options
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function getCompareOptions( newOptions ) {
        var options = !isDefinedObject( newOptions ) ? {} : newOptions;

        options.compareTimeout = getDefaultNumber( options.compareTimeout, 1000 );
        options.expires = getDefaultDate( options.expires, null );

        return options;
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Observe Options
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function getObserveOptions( newOptions ) {
        var options = !isDefinedObject( newOptions ) ? {} : newOptions;

        options.observeTimeout = getDefaultNumber( options.observeTimeout, 1000 );
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

    function getDefaultString( value, defaultValue ) {
        return isDefinedString( value ) ? value : defaultValue;
    }

    function getDefaultBoolean( value, defaultValue ) {
        return isDefinedBoolean( value ) ? value : defaultValue;
    }

    function getDefaultFunction( value, defaultValue ) {
        return isDefinedFunction( value ) ? value : defaultValue;
    }

    function getDefaultArray( value, defaultValue ) {
        return isDefinedArray( value ) ? value : defaultValue;
    }

    function getDefaultNumber( value, defaultValue ) {
        return isDefinedNumber( value ) ? value : defaultValue;
    }

    function getDefaultObject( value, defaultValue ) {
        return isDefinedObject( value ) ? value : defaultValue;
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


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public Functions:  Observables
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    this.addObservableObject = function( object, options ) {
        createObservableObject( object, options );
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
     * @param       {Options}   newConfiguration                            All the configuration options that should be set (refer to "Options" documentation for properties).
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