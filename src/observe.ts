/**
 * Observe.js
 * 
 * A lightweight JavaScript library that allows developers to keep track of changes to JavaScript objects and/or DOM elements.
 * 
 * @file        observe.ts
 * @version     v1.0.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */

import { Data } from "./ts/data";
import { Char } from "./ts/enum";
import { Is } from "./ts/is";
import { type WatchOptionEvents, type WatchOptions, type Configuration } from "./ts/type";


type StringToJson = {
    parsed: boolean;
    object: any;
};

type ObserveWatch = {
    options: WatchOptions;
    totalChanges: number;
    domElementId: string;
    cachedObject: any;
    originalObject: any;
    timer: number;
};


( () => {
    // Variables: Configuration
    let _configuration: Configuration = {} as Configuration;

    // Variables: Watches
    const _watches: Record<string, ObserveWatch> = {} as Record<string, ObserveWatch>;
    let _watches_Cancel: boolean = false;


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Watch Object Creation / Handling
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    function createWatch( object: any, options: any, domElementId: string ) : string {
        let storageId: string = null!;

        if ( Is.definedObject( object ) ) {
            storageId = Data.String.newGuid();

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
        for ( var propertyName in oldObject ) {
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
        let options: WatchOptions = Data.getDefaultObject( newOptions, {} as WatchOptions );

        options.timeout = Data.getDefaultNumber( options.timeout, 250 );
        options.starts = Data.getDefaultDate( options.starts, null! );
        options.expires = Data.getDefaultDate( options.expires, null! );
        options.reset = Data.getDefaultBoolean( options.reset, false );
        options.cancelOnChange = Data.getDefaultBoolean( options.cancelOnChange, false );
        options.maximumChangesBeforeCanceling = Data.getDefaultNumber( options.maximumChangesBeforeCanceling, 0 );
        options.pauseTimeoutOnChange = Data.getDefaultNumber( options.pauseTimeoutOnChange, 0 );
        options.propertyNames = Data.getDefaultArray( options.propertyNames, null! );
        options.allowCanceling = Data.getDefaultBoolean( options.allowCanceling, true );
        options.allowPausing = Data.getDefaultBoolean( options.allowPausing, true );
        options.removeAttribute = Data.getDefaultBoolean( options.removeAttribute, true );

        options = getWatchOptionsCustomTriggers( options );

        return options;
    }

    function getWatchOptionsCustomTriggers( options: WatchOptions ) : WatchOptions {
        options.events = Data.getDefaultObject( options.events, {} as WatchOptionEvents );
        options.events!.onChange = Data.getDefaultFunction( options.events!.onChange, null! );
        options.events!.onPropertyChange = Data.getDefaultFunction( options.events!.onPropertyChange, null! );
        options.events!.onCancel = Data.getDefaultFunction( options.events!.onCancel, null! );
        options.events!.onRemove = Data.getDefaultFunction( options.events!.onRemove, null! );
        options.events!.onStart = Data.getDefaultFunction( options.events!.onStart, null! );

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
     * Initialize Observe.js
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    ( () => {

    } )();
} )();