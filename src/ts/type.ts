/**
 * Observe.js
 * 
 * A lightweight JavaScript library that allows developers to keep track of changes to JavaScript objects and/or DOM elements.
 * 
 * @file        type.ts
 * @version     v1.0.1
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


export type Configuration = {
    safeMode?: boolean;
    domElementTypes?: string[] | string;
    text?: ConfigurationText;
};

export type ConfigurationText = {
    objectErrorText?: string;
    attributeNotValidErrorText?: string;
    attributeNotSetErrorText?: string;
};

export type WatchOptions = {
    timeout?: number;
    starts?: Date;
    expires?: Date;
    reset?: boolean;
    cancelOnChange?: boolean;
    maximumChangesBeforeCanceling?: number;
    pauseTimeoutOnChange?: number;
    propertyNames?: string[];
    allowCanceling?: boolean;
    allowPausing?: boolean;
    removeAttribute?: boolean;
    events?: WatchOptionEvents;
};

export type WatchOptionEvents = {
    onChange?: Function;
    onPropertyChange?: Function;
    onCancel?: Function;
    onRemove?: Function;
    onStart?: Function;
}

export type ObserveWatch = {
    options: WatchOptions;
    totalChanges: number;
    domElementId: string;
    cachedObject: any;
    originalObject: any;
    timer: number;
};