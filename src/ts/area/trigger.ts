/**
 * Observe.js
 * 
 * A lightweight JavaScript library that allows developers to keep track of changes to JavaScript objects and/or DOM elements.
 * 
 * @file        trigger.ts
 * @version     v1.1.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import { Is } from "../data/is";


export namespace Trigger {
    export function customEvent( triggerFunction: Function, ...args : any[] ) : void {
        if ( Is.definedFunction( triggerFunction ) ) {
            triggerFunction.apply( null, [].slice.call( args, 0 ) );
        }
    }
}