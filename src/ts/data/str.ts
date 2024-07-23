/**
 * Observe.js
 * 
 * A lightweight JavaScript library that allows developers to keep track of changes to JavaScript objects and/or DOM elements.
 * 
 * @file        str.ts
 * @version     v1.0.1
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import { Char } from "./enum";


export namespace Str {
    export function newGuid() : string {
        const result: string[] = [];

        for ( let charIndex: number = 0; charIndex < 32; charIndex++ ) {
            if ( charIndex === 8 || charIndex === 12 || charIndex === 16 || charIndex === 20 ) {
                result.push( Char.dash );
            }

            const character: string = Math.floor( Math.random() * 16 ).toString( 16 );
            result.push( character );
        }

        return result.join( Char.empty );
    }
}