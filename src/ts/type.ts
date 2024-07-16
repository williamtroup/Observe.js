/**
 * Observe.js
 * 
 * A lightweight JavaScript library that allows developers to keep track of changes to JavaScript objects and/or DOM elements.
 * 
 * @file        type.ts
 * @version     v1.0.0
 * @author      Bunoon
 * @license     MIT License
 * @copyright   Bunoon 2024
 */


export type Configuration = {
    safeMode?: boolean;
    domElementTypes?: string[] | string;
};

export type ConfigurationText = {
    objectErrorText?: string;
    attributeNotValidErrorText?: string;
    attributeNotSetErrorText?: string;
};

export type BindingOptions = {
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
    events?: BindingOptionEvents;
};

export type BindingOptionEvents = {
    onChange?: Function;
    onPropertyChange?: Function;
    onCancel?: Function;
    onRemove?: Function;
    onStart?: Function;
}