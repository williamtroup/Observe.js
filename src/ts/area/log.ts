/**
 * Observe.js
 * 
 * A lightweight JavaScript library that allows developers to keep track of changes to JavaScript objects and/or DOM elements.
 * 
 * @file        log.ts
 * @version     v1.1.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import { type Configuration } from "../type";


export namespace Log {
    export function error( error: string, configuration: Configuration ) : boolean {
        let result: boolean = true;

        if ( !configuration.safeMode ) {
            console.error( error );
            result = false;
        }

        return result;
    }
}