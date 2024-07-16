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
import { Is } from "./ts/is";
import { type WatchOptionEvents, type WatchOptions, type Configuration } from "./ts/type";


type StringToJson = {
    parsed: boolean;
    object: any;
};


( () => {
    // Variables: Configuration
    let _configuration: Configuration = {} as Configuration;


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