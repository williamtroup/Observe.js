/**
 * Observe.js
 * 
 * A lightweight JavaScript library that allows developers to keep track of changes to JavaScript objects and/or DOM elements.
 * 
 * @file        api.ts
 * @version     v1.0.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


import { type ObserveWatch, type WatchOptions } from "./type";


export type PublicApi = {
    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public API Functions:  Watching Objects
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     */

    /**
     * watch().
     * 
     * Adds an object that should be watched for changes.
     * 
     * @public
     * 
     * @param       {Object}    object                                      The object that should be watched. 
     * @param       {Object}    options                                     All the options that should be used.
     * 
     * @returns     {string}                                                The ID that object watch is stored under.
     */
    watch: ( object: any, options: WatchOptions ) => string;

    /**
     * cancelWatch().
     * 
     * Cancels the watching of an object for changes.
     * 
     * @public
     * 
     * @param       {string}    id                                          The Id of the object being watched, or DOM element ID being watched.
     * 
     * @returns     {boolean}                                               States if the object being watched has been cancelled.
     */
    cancelWatch: ( id: string ) => boolean;

    /**
     * cancelWatches().
     * 
     * Cancels all the watches currently running, or paused.
     * 
     * @public
     * 
     * @returns     {Object}                                                The Observe.js class instance.
     */
    cancelWatches: () => PublicApi;

    /**
     * getWatch().
     * 
     * Returns the properties for a running, or paused, watch.
     * 
     * @public
     * 
     * @param       {string}    id                                          The Id of the object being watched, or DOM element ID being watched.
     * 
     * @returns     {Object}                                                The watch properties for an object (null if not found).
     */
    getWatch: ( id: string ) => ObserveWatch;

    /**
     * getWatches().
     * 
     * Returns all the watches currently running, or paused.
     * 
     * @public
     * 
     * @returns     {Object}                                                The object of watches currently running, or paused.
     */
    getWatches: () => Record<string, ObserveWatch>;

    /**
     * pauseWatch().
     * 
     * Pauses the watching of an object for changes for a specific number of milliseconds.
     * 
     * @public
     * 
     * @param       {string}    id                                          The Id of the object being watched, or DOM element ID being watched.
     * @param       {number}    milliseconds                                The milliseconds to pause the watch for.
     * 
     * @returns     {boolean}                                               States if the object being watched has been paused.
     */
    pauseWatch: ( id: string, milliseconds: number ) => boolean;

    /**
     * pauseWatches().
     * 
     * Pauses all the watches for a specific number of milliseconds.
     * 
     * @public
     * 
     * @param       {number}    milliseconds                                The milliseconds to pause the watches for.
     * 
     * @returns     {Object}                                                The Observe.js class instance.
     */
    pauseWatches: ( milliseconds: number ) => PublicApi;

    /**
     * resumeWatch().
     * 
     * Resumes the watching of an object for changes after it was paused.
     * 
     * @public
     * 
     * @param       {string}    id                                          The Id of the object being watched, or DOM element ID being watched.
     * 
     * @returns     {boolean}                                               States if the watching of an object has been resumed
     */
    resumeWatch: ( id: string ) => boolean;

    /**
     * resumeWatches().
     * 
     * Resumes all the watches that are currently paused.
     * 
     * @public
     * 
     * @returns     {Object}                                                The Observe.js class instance.
     */
    resumeWatches: () => PublicApi;

    /**
     * searchDomForNewWatches().
     * 
     * Searches the DOM for new elements to watch, and adds them.
     * 
     * @public
     * 
     * @returns     {Object}                                                The Observe.js class instance.
     */
    searchDomForNewWatches: () => PublicApi;


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public API Functions:  Configuration
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
	setConfiguration: ( newConfiguration: any ) => PublicApi;


    /*
     * ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     * Public API Functions:  Additional Data
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
	getVersion: () => string;
};

declare global {
	interface Window {
		$observe: PublicApi;
	}
}