/**
 * Make HtmlElement draggable
 * @param {HTMLElement} element Draggable element
 * @param {number} shadowRadius Radius os shadow when element is detached in px
 * @param {number} borderRadius Radius of unsnapped border corners when element is detached in px
 * @param {number} snapDistance Snap distance in px. 0 = no snap
 */
function draggable(element, {shadowRadius, borderRadius, snapDistance} = {}) {
    if (!element) throw new Error("@sphericcube/draggable: Element not provided")
    
    shadowRadius = shadowRadius || 0;
    borderRadius = borderRadius || 0;
    snapDistance = snapDistance || 0;

    if(shadowRadius && (typeof shadowRadius !== 'number')) throw new Error(`@sphericcube/draggable: Shadow radius must be a number. ${typeof shadowRadius} is given`);
    if(borderRadius && (typeof borderRadius !== 'number')) throw new Error(`@sphericcube/draggable: Border radius must be a number. ${typeof borderRadius} is given`);
    if(snapDistance && (typeof snapDistance !== 'number')) throw new Error(`@sphericcube/draggable: Snap distance must be a number. ${typeof snapDistance} is given`);

    /** @var {HTMLElement} replacementElement */
    let replacementElement = null;

    /**
     * On drag start
     * @param {DragEvent} dragStartEvent 
     */
    function preventDrag(dragStartEvent){
        dragStartEvent.preventDefault();
        drawSnapBorder(0,0,0,0);
    }

    /**
     * On drag start
     * @param {DragEvent} dragStartEvent 
     */
    function detach(dragStartEvent){
        preventDrag(dragStartEvent);

        replacementElement = element.cloneNode(false);

        element.style.position = 'fixed';
        element.style.left = `${element.x}px`;
        element.style.top = `${element.y}px`;
        element.style.zIndex = '999999';
        element.style.boxShadow = `0 0 ${shadowRadius}px`;

        //configure replacement element
        replacementElement.style.visibility = 'hidden';

        element.parentNode.replaceChild(replacementElement,element);

        document.body.appendChild(element);

        element.removeEventListener('dragstart',detach);
        element.addEventListener('dragstart',preventDrag);
    }

    /**
     * On mouse move
     * @param {MouseEvent} mouseMoveEvent 
     */
    function onMove(mouseMoveEvent){
        if(mouseMoveEvent.buttons || mouseMoveEvent.which){
            element.style.left = `${element.x + mouseMoveEvent.movementX}px`;
            element.style.top = `${element.y + mouseMoveEvent.movementY}px`;
            element.style.cursor = 'pointer';
        } else {
            element.style.cursor = '';
        }
    }

    function drawSnapBorder(snapTL = 0, snapTR = 0, snapBR = 0, snapBL = 0){
        element.style.borderRadius = `${snapTL ? 0 : borderRadius}px ${snapTR ? 0 : borderRadius}px ${snapBR ? 0 : borderRadius}px ${snapBL ? 0 : borderRadius}px`;
    }

    function snapToWindow(){
        let xPos = element.x,
            yPos = element.y,
            snapX = 0,
            snapY = 0;

        if((xPos + element.clientWidth + snapDistance) > document.body.clientWidth){
            xPos = document.body.clientWidth - element.clientWidth;
            snapX = 1;
        } else if(xPos < snapDistance) {
            xPos = 0;
            snapX = -1;
        }

        if((yPos + element.clientHeight + snapDistance) > window.innerHeight){
            yPos = window.innerHeight - element.clientHeight;
            snapY = 1;
        } else if(yPos < snapDistance) {
            yPos = 0;
            snapY = -1;
        }

        element.style.left = xPos + 'px';
        element.style.top  = yPos + 'px';

        drawSnapBorder(
            (snapX < 0) || (snapY < 0),
            (snapX > 0) || (snapY < 0),
            (snapX > 0) || (snapY > 0),
            (snapX < 0) || (snapY > 0)
        );

        return snapX && snapY
    }

    function snapToContainer(){
        let snap = (Math.abs(element.x - replacementElement.x) < snapDistance) && (Math.abs(element.y - replacementElement.y) < snapDistance);

        if(snap){
            element.style.left = replacementElement.left;
            element.style.top  = replacementElement.top;
            element.style.position = replacementElement.style.position;
            element.style.borderRadius = replacementElement.style.borderRadius;
            element.style.boxShadow = replacementElement.style.boxShadow;

            replacementElement.parentNode.replaceChild(element,replacementElement)
            element.addEventListener('dragstart',detach);
            element.removeEventListener('dragstart',preventDrag);
        }

        return snap
    }

    function snap(){
        if(snapDistance) {
            snapToContainer() || snapToWindow()
        }
    }

    const options = {
        passive: true
    }

    element.addEventListener('mousemove', onMove, options);
    element.addEventListener('mouseup', snap, options);
    element.addEventListener('mouseleave', e => {
        if(e.buttons || e.which){
            snap()
        }
    }, options);
    element.addEventListener('dragstart',detach);
}

module.exports = draggable;