# Draggable

Make HTMLElement draggable. With snapping

## How to use
Can be called without options
```javascript
const someHTMLElement = document.getElementById('someHTMLElement');

draggable(someHTMLElement)
```

... or with options provided
```javascript
const someHTMLElement = document.getElementById('someHTMLElement'),
      draggableOptions = {
        shadowRadius: 10,
        borderRadius: 10,
        snapRadius: 100
      };

draggable(someHTMLElement,draggableOptions)
```
## Draggable options
### Shadow radius
```javascript
draggable(someHTMLElement,{
  ...
  shadowRadius: 10 // Radius of box-shadow attribute applied to element when it is in detached state
  ...
})
```
applied css looks like this
```css
{
  box-shadow: 0 0 [shadowRadius]px;
}
```
### Border radius
```javascript
draggable(someHTMLElement,{
  ...
  borderRadius: 10 // Border radius attribute applied to element when it is in detached state
  ...
})
```
applied css looks like this
```css
{
  border-radius: [borderRadius]px [borderRadius]px [borderRadius]px [borderRadius]px;
}
```
### Snap distance
```javascript
draggable(someHTMLElement,{
  ...
  snapDistance: 10 // Border radius attribute applied to element when it is in detached state
  ...
})
```
When dragged element is close to window borders or to original position it will be snapped

**If snapDistance is equal to any false value snapping will be disabled**
