/* 
    Name: keyframer.js
    Author: raghavm
    Description: JS Library that allows easy interaction with CSS Animations.
    GitHub: https://github.com/raghav-misra/keyframer-js
*/

var keyframer = {};

/* ----------------------------- */
// Event Tracker:
keyframer.eventTracker = {};

function createKeyframerEvent(elementQuery, mainQuery, event, func){
    var element = document.querySelector(elementQuery);
    if(!keyframer.eventTracker.hasOwnProperty(mainQuery))
        keyframer.eventTracker[mainQuery] = {};
    keyframer.eventTracker[mainQuery]["keyframer-" + event] = [elementQuery, func];
    element.addEventListener(
        event, keyframer.eventTracker[mainQuery]["keyframer-" + event][1]
    );
};

keyframer.revokeEvent = (elementQuery, event) =>{
    try{
        var element = document.querySelector(keyframer.eventTracker[elementQuery]["keyframer-" + event][0]);
        element.removeEventListener(
            event, keyframer.eventTracker[elementQuery]["keyframer-" + event][1]
        );
        delete keyframer.eventTracker[elementQuery]["keyframer-" + event];
    }
    catch(e){ console.warn("That event was never created!"); }
};

/* ----------------------------- */
// Create Animation:
keyframer.createCSSAnimation = 
(elementQuery, animationData, removeTimeoutMS=NaN, callback=()=>{}) => {
    var elem = document.querySelector(elementQuery);
    elem.style.animation = animationData;
    if(removeTimeoutMS){
        setTimeout(()=>{
            keyframer.revokeCSSAnimation(elementQuery);
            callback(elem)
        }, removeTimeoutMS);
    }
};

// Create Animation On "EVENT":
keyframer.createCSSAnimationOn = 
(event, elementQuery, animationData, removeTimeoutMS=NaN, callback=()=>{}, eventReceiver=null) => {
    if(!isNotNullUndefinedOrNaN(eventReceiver)) eventReceiver = elementQuery;
    keyframer.revokeEvent(elementQuery, event);
    createKeyframerEvent(
        eventReceiver, elementQuery, event,
        ()=>{ keyframer.createCSSAnimation(elementQuery, animationData, removeTimeoutMS, callback); }
    );
};

// Create Animation On Key "EVENT":
keyframer.createCSSAnimationOnKey = 
(keyEvent, elementQuery, animationData, allowedKeys, removeTimeoutMS=NaN, callback=()=>{}, eventReceiver=null) => {
    if(!isNotNullUndefinedOrNaN(eventReceiver)) eventReceiver = elementQuery;
    var keyEv = keyEvent.replace("key", "");
    keyframer.revokeEvent(elementQuery, "key"+keyEv);
    createKeyframerEvent(
        eventReceiver, elementQuery, "key"+keyEv,
        (ev)=>{
            if(!inArray(allowedKeys, ev.key) && !inArray(allowedKeys, ev.code)) return;
            keyframer.createCSSAnimation(elementQuery, animationData, removeTimeoutMS, callback);
        }
    );
};

// Remove Animation:
keyframer.revokeCSSAnimation = (elementQuery) => {
    var elem = document.querySelector(elementQuery);
    elem.style.animation = "none";
};

/* ----------------------------- */
// Create Transition:
keyframer.createCSSTransition = 
(elementQuery, transitionData, appliedFrame = {}, callback=()=>{}) => {
    document.querySelector(elementQuery).style.transition = transitionData;
    keyframer.setStyles(elementQuery, appliedFrame, callback);
};

// Create Transition On "EVENT":
keyframer.createCSSTransitionOn = 
(event, elementQuery, transitionData, appliedFrame={}, eventReceiver=null, callback=()=>{}) => {
    if(!isNotNullUndefinedOrNaN(eventReceiver)) eventReceiver = elementQuery;
    keyframer.revokeEvent(elementQuery, event);
    createKeyframerEvent(
        eventReceiver, elementQuery, event,
        ()=>{ keyframer.createCSSTransition(elementQuery, transitionData, appliedFrame, callback); }
    );      

}

// Create Transition On Key "EVENT":
keyframer.createCSSTransitionOnKey = 
(keyEvent, elementQuery, transitionData, allowedKeys, appliedFrame={}, eventReceiver=null, callback=()=>{}) => {
    if(!isNotNullUndefinedOrNaN(eventReceiver)) eventReceiver = elementQuery;
    var keyEv = keyEvent.replace("key", "");
    keyframer.revokeEvent(elementQuery, "key"+keyEv);
    createKeyframerEvent(
        eventReceiver, elementQuery, "key"+keyEv,
        (ev)=>{
            if(!inArray(allowedKeys, ev.key) && !inArray(allowedKeys, ev.code)) return;
            keyframer.createCSSTransition(elementQuery, transitionData, appliedFrame , callback); 
        }
    );
};
/* ----------------------------- */

// Change Styles @ Runtime
keyframer.setStyles = (elementQuery, appliedFrame = {}, callback=()=>{}) => {
    element = document.querySelector(elementQuery);
    for(var attribute in appliedFrame){
        if(!appliedFrame.hasOwnProperty(attribute)) continue;
        element.style[attribute] = appliedFrame[attribute];
    }
    callback(element);
}
/* ----------------------------- */
// Frame Storage Object:
keyframer.frames = {};

// Create Frame:
keyframer.createFrame = (frameName, frameData={}) => {
    keyframer.frames[frameName] = frameData;
}

keyframer.getFrame = (frameName) => {
    return keyframer.frames[frameName];
}

// Apply Frame Data From Attribute:
keyframer.applyFromAttribute = (attribute = "data-frame") =>{
    Array.from(document.querySelectorAll(`[${attribute}]`)).forEach(element => {
        keyframer.setStyles(element, keyframer.frames[element.getAttribute(attribute)]);
    });
}



// Utility Functions
function isNotNullUndefinedOrNaN(value){
    if(value == null || value == NaN || value == undefined) return false;
    else return true;
}

function inArray(array, item) {
    if(array.indexOf(item) != -1) return true;
    return false;
}