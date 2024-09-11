/**
 * Observe.js
 * 
 * A lightweight JavaScript library that allows developers to keep track of changes to JavaScript objects and/or DOM elements.
 * 
 * @file        watch.ts
 * @version     v1.1.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import { type WatchOptionEvents, type WatchOptions } from "../type";
import { Default } from "../data/default";


export namespace Watch {
    export namespace Options {
        export function get( newOptions: any ) : WatchOptions {
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
    
            options = getEvents( options );
    
            return options;
        }
    
        function getEvents( options: WatchOptions ) : WatchOptions {
            options.events = Default.getObject( options.events, {} as WatchOptionEvents );
            options.events!.onChange = Default.getFunction( options.events!.onChange, null! );
            options.events!.onPropertyChange = Default.getFunction( options.events!.onPropertyChange, null! );
            options.events!.onCancel = Default.getFunction( options.events!.onCancel, null! );
            options.events!.onRemove = Default.getFunction( options.events!.onRemove, null! );
            options.events!.onStart = Default.getFunction( options.events!.onStart, null! );
    
            return options;
        }
    }
}