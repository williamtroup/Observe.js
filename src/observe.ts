/**
 * Observe.js
 * 
 * A lightweight JavaScript library that allows developers to keep track of changes to JavaScript objects and/or DOM elements.
 * 
 * @file        observe.ts
 * @version     v1.0.1
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import {
    type WatchOptionEvents,
    type WatchOptions,
    type Configuration,
    type ObserveWatch, 
    type ConfigurationText } from "./ts/type";

import { type PublicApi } from "./ts/api";
import { Constant } from "./ts/constant";
import { Default } from "./ts/data/default";
import { Char } from "./ts/data/enum";
import { Is } from "./ts/data/is";
import { Str } from "./ts/data/str";


type StringToJson = {
    parsed: boolean;
    object: any;
};


( () => {
    // Variables: Configuration
    let _configuration: Configuration = {} as Configuration;

    // Variables: Watches
    const _watches: Record<string, ObserveWatch> = {} as Record<string, ObserveWatch>;
    let _watches_Cancel: boolean = false;


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Observable DOM Object Creation / Handling
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function collectDOMObjects() : void {
        const tagTypes: string[] = _configuration.domElementTypes as string[];
        const tagTypesLength: number = tagTypes.length;

        for ( let tagTypeIndex: number = 0; tagTypeIndex < tagTypesLength; tagTypeIndex++ ) {
            const domElements: HTMLCollectionOf<Element> = document.getElementsByTagName( tagTypes[ tagTypeIndex ] );
            const elements: HTMLElement[] = [].slice.call( domElements );
            const elementsLength: number = elements.length;

            for ( let elementIndex: number = 0; elementIndex < elementsLength; elementIndex++ ) {
                if ( !collectDOMObject( elements[ elementIndex ] ) ) {
                    break;
                }
            }
        }
    }

    function collectDOMObject( element: HTMLElement ) : boolean {
        let result: boolean = true;

        if ( Is.defined( element ) && element.hasAttribute( Constant.OBSERVE_JS_ATTRIBUTE_NAME ) ) {
            const bindingOptionsData: string = element.getAttribute( Constant.OBSERVE_JS_ATTRIBUTE_NAME )!;

            if ( Is.definedString( bindingOptionsData ) ) {
                const watchOptionsJson: StringToJson = getObjectFromString( bindingOptionsData );

                if ( watchOptionsJson.parsed && Is.definedObject( watchOptionsJson.object ) ) {
                    const watchOptions: WatchOptions = getWatchOptions( watchOptionsJson.object );

                    if ( !Is.definedString( element.id ) ) {
                        element.id = Str.newGuid();
                    }

                    if ( watchOptions.removeAttribute ) {
                        element.removeAttribute( Constant.OBSERVE_JS_ATTRIBUTE_NAME );
                    }

                    createWatch( element, watchOptions, element.id );

                } else {
                    logError( _configuration.text!.attributeNotValidErrorText!.replace( "{{attribute_name}}", Constant.OBSERVE_JS_ATTRIBUTE_NAME ) );
                    result = false;
                }

            } else {
                logError( _configuration.text!.attributeNotSetErrorText!.replace( "{{attribute_name}}", Constant.OBSERVE_JS_ATTRIBUTE_NAME ) );
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

    function createWatch( object: any, options: any, domElementId: string = null! ) : string {
        let storageId: string = null!;

        if ( Is.definedObject( object ) ) {
            storageId = Str.newGuid();

            const watchOptions: WatchOptions = getWatchOptions( options );
            const watch: ObserveWatch = {} as ObserveWatch;
            let startWatchObject: any = null;

            watch.options = watchOptions;
            watch.totalChanges = 0;

            if ( Is.definedString( domElementId ) ) {
                const domElement: HTMLElement = document.getElementById( domElementId )!;

                if ( Is.defined( domElement ) ) {
                    watch.domElementId = domElementId;
                    watch.cachedObject = domElement.outerHTML;
                    watch.originalObject = domElement.outerHTML;

                    startWatchObject = domElement.outerHTML;
                }

            } else {
                watch.cachedObject = JSON.stringify( object );
                watch.originalObject = object;

                startWatchObject = object;
            }

            if ( Is.defined( watch.cachedObject ) ) {
                fireCustomTriggerEvent( watch.options.events!.onStart!, startWatchObject );

                watch.timer = setInterval( function() {
                    watchTimer( watchOptions, storageId );
                }, watchOptions.timeout );
    
                _watches[ storageId ] = watch;
            }
        }

        return storageId;
    }

    function watchTimer( watchOptions: WatchOptions, storageId: string ) : void {
        const currentDateTime: Date = new Date();

        if ( !Is.definedDate( watchOptions.starts ) || currentDateTime >= watchOptions.starts! ) {
            watchObjectForChanges( storageId );

            if ( Is.definedDate( watchOptions.expires ) && currentDateTime >= watchOptions.expires! ) {
                cancelWatchObject( storageId );
            }
        }
    }

    function watchObjectForChanges( storageId: string ) : void {
        if ( _watches.hasOwnProperty( storageId ) ) {
            const watch: ObserveWatch = _watches[ storageId ];
            const isDomElement: boolean = Is.definedString( watch.domElementId );
            let domElement: HTMLElement = null!;

            if ( isDomElement ) {
                domElement = document.getElementById( watch.domElementId )!;

                if ( Is.defined( domElement ) ) {
                    watch.originalObject = domElement.outerHTML;
                } else {
                    watch.originalObject = Char.empty;

                    fireCustomTriggerEvent( watch.options.events!.onRemove!, watch.domElementId );
                }
            }

            const cachedObject: any = watch.cachedObject;
            const originalObject: any = watch.originalObject;
            const originalObjectJson: any = !isDomElement ? JSON.stringify( originalObject ) : originalObject;

            if ( cachedObject !== originalObjectJson ) {
                if ( watch.options.reset ) {
                    if ( isDomElement ) {
                        domElement.outerHTML = watch.cachedObject;
                    } else {
                        watch.originalObject = getObjectFromString( cachedObject ).object;
                    }

                } else {
                    watch.cachedObject = originalObjectJson;
                }

                if ( isDomElement ) {
                    fireCustomTriggerEvent( watch.options.events!.onChange!, cachedObject, originalObjectJson );
                } else {

                    const oldValue: any = getObjectFromString( cachedObject ).object;
                    const newValue: any = getObjectFromString( originalObjectJson ).object;

                    if ( !Is.definedArray( oldValue ) && !Is.definedArray( newValue ) ) {
                        compareWatchObject( oldValue, newValue, watch );

                        if ( Is.definedFunction( watch.options.events!.onPropertyChange ) ) {
                            compareWatchObjectProperties( oldValue, newValue, watch );
                        }
                        
                    } else {
                        fireCustomTriggerEvent( watch.options.events!.onChange!, oldValue, newValue );
                    }
                }

                watch.totalChanges++;

                if ( watch.options.pauseTimeoutOnChange! > 0 ) {
                    pauseWatchObject( storageId, watch.options.pauseTimeoutOnChange! );
                }

                if ( watch.options.cancelOnChange ) {
                    cancelWatchObject( storageId );
                }

                if ( watch.options.maximumChangesBeforeCanceling! > 0 && watch.totalChanges >= watch.options.maximumChangesBeforeCanceling! ) {
                    cancelWatchObject( storageId );
                }
            }
        }
    }

    function compareWatchObject( oldObject: any, newObject: any, watch: ObserveWatch ) : void {
        if ( Is.definedArray( watch.options.propertyNames ) ) {
            const propertyNamesLength: number = watch.options.propertyNames!.length;

            for ( let propertyNameIndex: number = 0; propertyNameIndex < propertyNamesLength; propertyNameIndex++ ) {
                const propertyName: string = watch.options.propertyNames![ propertyNameIndex ];

                if ( oldObject[ propertyName ] !== newObject[ propertyName ] ) {
                    fireCustomTriggerEvent( watch.options.events!.onChange!, oldObject, newObject );
                    break;
                }
            }

        } else {
            fireCustomTriggerEvent( watch.options.events!.onChange!, oldObject, newObject );
        }
    }

    function compareWatchObjectProperties( oldObject: any, newObject: any, watch: ObserveWatch ) : void {
        for ( let propertyName in oldObject ) {
            if ( oldObject.hasOwnProperty( propertyName ) ) {
                const propertyOldValue: any = oldObject[ propertyName ];
                let propertyNewValue: any = null;

                if ( newObject.hasOwnProperty( propertyName ) ) {
                    propertyNewValue = newObject[ propertyName ];
                }

                if ( Is.definedObject( propertyOldValue ) && Is.definedObject( propertyNewValue ) ) {
                    compareWatchObjectProperties( propertyOldValue, propertyNewValue, watch );
                } else {

                    if ( !Is.definedArray( watch.options.propertyNames ) || watch.options.propertyNames!.indexOf( propertyName ) > -1 ) {
                        if ( JSON.stringify( propertyOldValue ) !== JSON.stringify( propertyNewValue ) ) {
                            fireCustomTriggerEvent( watch.options.events!.onPropertyChange!, propertyName, propertyOldValue, propertyNewValue );
                        }
                    }
                }
            }
        }
    }

    function cancelWatchesForObjects() : void {
        for ( let storageId in _watches ) {
            if ( _watches.hasOwnProperty( storageId ) ) {
                cancelWatchObject( storageId );
            }
        }
    }

    function cancelWatchObject( storageId: string ) : void {
        if ( _watches.hasOwnProperty( storageId ) ) {
            const watchOptions: WatchOptions = _watches[ storageId ].options;

            if ( watchOptions.allowCanceling || _watches_Cancel ) {
                fireCustomTriggerEvent( watchOptions.events!.onCancel!, storageId );
                clearInterval( _watches[ storageId ].timer );
                
                delete _watches[ storageId ];
            }
        }
    }

    function pauseWatchObject( storageId: string, milliseconds: number ) : boolean {
        let result: boolean = false;

        if ( _watches.hasOwnProperty( storageId ) ) {
            const watchOptions: WatchOptions = _watches[ storageId ].options;

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

    function getWatchOptions( newOptions: any ) : WatchOptions {
        let options: WatchOptions = Default.getObject( newOptions, {} as WatchOptions );

        options.timeout = Default.getNumber( options.timeout, 250 );
        options.starts = Default.getDate( options.starts, null! );
        options.expires = Default.getDate( options.expires, null! );
        options.reset = Default.getBoolean( options.reset, false );
        options.cancelOnChange = Default.getBoolean( options.cancelOnChange, false );
        options.maximumChangesBeforeCanceling = Default.getNumber( options.maximumChangesBeforeCanceling, 0 );
        options.pauseTimeoutOnChange = Default.getNumber( options.pauseTimeoutOnChange, 0 );
        options.propertyNames = Default.getArray( options.propertyNames, null! );
        options.allowCanceling = Default.getBoolean( options.allowCanceling, true );
        options.allowPausing = Default.getBoolean( options.allowPausing, true );
        options.removeAttribute = Default.getBoolean( options.removeAttribute, true );

        options = getWatchOptionsCustomTriggers( options );

        return options;
    }

    function getWatchOptionsCustomTriggers( options: WatchOptions ) : WatchOptions {
        options.events = Default.getObject( options.events, {} as WatchOptionEvents );
        options.events!.onChange = Default.getFunction( options.events!.onChange, null! );
        options.events!.onPropertyChange = Default.getFunction( options.events!.onPropertyChange, null! );
        options.events!.onCancel = Default.getFunction( options.events!.onCancel, null! );
        options.events!.onRemove = Default.getFunction( options.events!.onRemove, null! );
        options.events!.onStart = Default.getFunction( options.events!.onStart, null! );

        return options;
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Triggering Custom Events
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function fireCustomTriggerEvent( triggerFunction: Function, ...args : any[] ) : void {
        if ( Is.definedFunction( triggerFunction ) ) {
            triggerFunction.apply( null, [].slice.call( args, 0 ) );
        }
    }


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Default Parameter/Option Handling
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function getObjectFromString( objectString: any ) : StringToJson {
        const result: StringToJson = {
            parsed: true,
            object: null
        } as StringToJson;

        try {
            if ( Is.definedString( objectString ) ) {
                result.object = JSON.parse( objectString );
            }

        } catch ( e1: any ) {
            try {
                result.object = eval( `(${objectString})` );

                if ( Is.definedFunction( result.object ) ) {
                    result.object = result.object();
                }
                
            } catch ( e2: any ) {
                if ( !_configuration.safeMode ) {
                    logError( _configuration.text!.objectErrorText!.replace( "{{error_1}}",  e1.message ).replace( "{{error_2}}",  e2.message ) );
                    result.parsed = false;
                }
                
                result.object = null;
            }
        }

        return result;
    }

    function logError( error: string ) : boolean {
        let result: boolean = true;

        if ( !_configuration.safeMode ) {
            console.error( error );
            result = false;
        }

        return result;
    }


	/*
	 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	 * Public API Functions:  Helpers:  Configuration
	 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	 */

    function buildDefaultConfiguration( newConfiguration: any = null ) : void {
        _configuration = Default.getObject( newConfiguration, {} as Configuration );
        _configuration.safeMode = Default.getBoolean( _configuration.safeMode, true );
        _configuration.domElementTypes = Default.getStringOrArray( _configuration.domElementTypes, [ "*" ] );

        buildDefaultConfigurationStrings();
    }

    function buildDefaultConfigurationStrings() : void {
        _configuration.text = Default.getObject( _configuration.text, {} as ConfigurationText );
        _configuration.text!.objectErrorText = Default.getString( _configuration.text!.objectErrorText, "Errors in object: {{error_1}}, {{error_2}}" );
        _configuration.text!.attributeNotValidErrorText = Default.getString( _configuration.text!.attributeNotValidErrorText, "The attribute '{{attribute_name}}' is not a valid object." );
        _configuration.text!.attributeNotSetErrorText = Default.getString( _configuration.text!.attributeNotSetErrorText, "The attribute '{{attribute_name}}' has not been set correctly." );        
    }


	/*
	 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	 * Public API Functions:
	 * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	 */

    const _public: PublicApi = {
        /*
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         * Public API Functions:  Watching Objects
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         */

        watch: function ( object: any, options: WatchOptions ) : string {
            return createWatch( object, options );
        },

        cancelWatch: function ( id: string ) : boolean {
            let result: boolean = false;

            if ( Is.definedString( id ) ) {
                if ( _watches.hasOwnProperty( id ) ) {
                    cancelWatchObject( id );
        
                    result = true;
                } else {
        
                    for ( let storageId in _watches ) {
                        if ( _watches.hasOwnProperty( storageId ) && Is.definedString( _watches[ storageId ].domElementId ) && _watches[ storageId ].domElementId === id ) {
                            cancelWatchObject( storageId );
                
                            result = true;
                            break;
                        }
                    }
                }
            }
    
            return result;
        },

        cancelWatches: function () : PublicApi {
            cancelWatchesForObjects();

            return _public;
        },

        getWatch: function ( id: string ) : ObserveWatch {
            let result: ObserveWatch = null!;

            if ( Is.definedString( id ) ) {
                if ( _watches.hasOwnProperty( id ) ) {
                    result = _watches[ id ];
                } else {
        
                    for ( let storageId in _watches ) {
                        if ( _watches.hasOwnProperty( storageId ) && Is.definedString( _watches[ storageId ].domElementId ) && _watches[ storageId ].domElementId === id ) {
                            result = _watches[ storageId ];
                            break;
                        }
                    }
                }
            }
    
            return result;
        },

        getWatches: function () : Record<string, ObserveWatch> {
            return _watches;
        },

        pauseWatch: function ( id: string, milliseconds: number ) : boolean {
            let result: boolean = false;

            if ( Is.definedString( id ) && Is.definedNumber( milliseconds ) ) {
                if ( _watches.hasOwnProperty( id ) ) {
                    result = pauseWatchObject( id, milliseconds );
                } else {
        
                    for ( let storageId in _watches ) {
                        if ( _watches.hasOwnProperty( storageId ) && Is.definedString( _watches[ storageId ].domElementId ) && _watches[ storageId ].domElementId === id ) {
                            result = pauseWatchObject( storageId, milliseconds );
                            break;
                        }
                    }
                }
            }
    
            return result;
        },

        pauseWatches: function ( milliseconds: number ) : PublicApi {
            if ( Is.definedNumber( milliseconds ) ) {
                for ( let storageId in _watches ) {
                    if ( _watches.hasOwnProperty( storageId ) ) {
                        pauseWatchObject( storageId, milliseconds );
                    }
                }
            }
    
            return _public;
        },

        resumeWatch: function ( id: string ) : boolean {
            let result: boolean = false;

            if ( Is.definedString( id ) ) {
                if ( _watches.hasOwnProperty( id ) ) {
                    _watches[ id ].options.starts = null!;
                    result = true;
                } else {
        
                    for ( let storageId in _watches ) {
                        if ( _watches.hasOwnProperty( storageId ) && Is.definedString( _watches[ storageId ].domElementId ) && _watches[ storageId ].domElementId === id ) {
                            _watches[ storageId ].options.starts = null!;
                            result = true;
                            break;
                        }
                    }
                }
            }
    
            return result;
        },

        resumeWatches: function () : PublicApi {
            for ( let storageId in _watches ) {
                if ( _watches.hasOwnProperty( storageId ) ) {
                    _watches[ storageId ].options.starts = null!;
                }
            }
    
            return _public;
        },

        searchDomForNewWatches: function () : PublicApi {
            collectDOMObjects();

            return _public;
        },


        /*
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         * Public API Functions:  Configuration
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         */

        setConfiguration: function ( newConfiguration: any ) : PublicApi {
            if ( Is.definedObject( newConfiguration ) ) {
                let configurationHasChanged: boolean = false;
                const newInternalConfiguration: any = _configuration;
            
                for ( let propertyName in newConfiguration ) {
                    if ( newConfiguration.hasOwnProperty( propertyName ) && _configuration.hasOwnProperty( propertyName ) && newInternalConfiguration[ propertyName ] !== newConfiguration[ propertyName ] ) {
                        newInternalConfiguration[ propertyName ] = newConfiguration[ propertyName ];
                        configurationHasChanged = true;
                    }
                }
        
                if ( configurationHasChanged ) {
                    buildDefaultConfiguration( newInternalConfiguration );
                }
            }
    
            return _public;
        },


        /*
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         * Public API Functions:  Additional Data
         * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
         */

        getVersion: function () : string {
            return "1.0.1";
        }
    };


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Initialize Observe.js
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    ( () => {
        buildDefaultConfiguration();

        document.addEventListener( "DOMContentLoaded", function() {
            collectDOMObjects();
        } );

        window.addEventListener( "pagehide", function() {
            _watches_Cancel = true;

            cancelWatchesForObjects();
        } );

        if ( !Is.defined( window.$observe ) ) {
            window.$observe = _public;
        }
    } )();
} )();