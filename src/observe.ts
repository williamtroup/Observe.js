/**
 * Observe.js
 * 
 * A lightweight JavaScript library that allows developers to keep track of changes to JavaScript objects and/or DOM elements.
 * 
 * @file        observe.ts
 * @version     v1.1.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import {
    type WatchOptions,
    type Configuration,
    type ObserveWatch } from "./ts/type";

import { type PublicApi } from "./ts/api";
import { Constant } from "./ts/constant";
import { Char } from "./ts/data/enum";
import { Is } from "./ts/data/is";
import { Str } from "./ts/data/str";
import { Config } from "./ts/options/config";
import { Watch } from "./ts/options/watch";
import { Trigger } from "./ts/area/trigger";


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
                    const watchOptions: WatchOptions = Watch.Options.get( watchOptionsJson.object );

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

            const watchOptions: WatchOptions = Watch.Options.get( options );
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
                Trigger.customEvent( watch.options.events!.onStart!, startWatchObject );

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

                    Trigger.customEvent( watch.options.events!.onRemove!, watch.domElementId );
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
                    Trigger.customEvent( watch.options.events!.onChange!, cachedObject, originalObjectJson );
                } else {

                    const oldValue: any = getObjectFromString( cachedObject ).object;
                    const newValue: any = getObjectFromString( originalObjectJson ).object;

                    if ( !Is.definedArray( oldValue ) && !Is.definedArray( newValue ) ) {
                        compareWatchObject( oldValue, newValue, watch );

                        if ( Is.definedFunction( watch.options.events!.onPropertyChange ) ) {
                            compareWatchObjectProperties( oldValue, newValue, watch );
                        }
                        
                    } else {
                        Trigger.customEvent( watch.options.events!.onChange!, oldValue, newValue );
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
                    Trigger.customEvent( watch.options.events!.onChange!, oldObject, newObject );
                    break;
                }
            }

        } else {
            Trigger.customEvent( watch.options.events!.onChange!, oldObject, newObject );
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
                            Trigger.customEvent( watch.options.events!.onPropertyChange!, propertyName, propertyOldValue, propertyNewValue );
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
                Trigger.customEvent( watchOptions.events!.onCancel!, storageId );
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
                    _configuration = Config.Options.get( newInternalConfiguration );
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
            return "1.1.0";
        }
    };


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Initialize Observe.js
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    ( () => {
        _configuration = Config.Options.get();

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