var tooltipModule = (function() {

  function createContainer() {
    var container = document.createElement("div");
    container.setAttribute('class', 'container');
    container.setAttribute('id', 'container');
    return container;
  }

  function createContent() {
    var content = document.createElement("div");
    content.setAttribute('role', 'tooltip');
    content.setAttribute('class', 'content');
    return content;
  }

  function createArrow() {
    var arrow = document.createElement("div");
    arrow.setAttribute('class', 'arrow');
    return arrow;
  }

  function hide(elem) {
    elem.setAttribute('style', 'display: none');
  }

  function show() {
    container.removeAttribute('style');
  }

  function getElementsByAttr(attr, allElements) {
    return Array.prototype.slice.call(allElements)
      .filter(function(element) {
        return !! element.getAttribute(attr);
      });
  }

  function apply(selector) {

    var allElements = document.getElementsByTagName(selector);
    var elements = [];
    var container = createContainer();
    var content = createContent();
    var arrow = createArrow();

    hide(container);
    container.appendChild(content);
    container.appendChild(arrow);

    getElementsByAttr('data-tooltip', allElements)
      .forEach(bindTooltipEvents);

    document.body.appendChild(container);

    for (var i = 0; i < elements.length; i += 1) {
      currentTooltip = elements[i];
      currentTooltip.addEventListener('focus', handleTooltipFocus, false);
      currentTooltip.addEventListener('blur', handleTooltipBlur, false);
    }

    function bindTooltipEvents(currentTooltip) {
      currentTooltip.addEventListener('focus', handleTooltipFocus, false);
      currentTooltip.addEventListener('blur', handleTooltipBlur, false);
    }

    function handleTooltipFocus() {
      var element = this, tooltipElement;
      var position;

      if (typeof(element.getAttribute) === 'function') {
        tooltipElement = element;
      } else if (typeof(window.event.srcElement.getAttribute) === 'object') {
        tooltipElement = window.event.srcElement;
      }

      var direction = element.getAttribute('data-placement') || 'top';
      var text = element.getAttribute('data-tooltip') || '';

      content.innerHTML = text;
      show(container);

      var targetOffsetTop = parseInt(tooltipElement.offsetTop);
      var targetOffsetLeft = parseInt(tooltipElement.offsetLeft);
      var targetWidth = tooltipElement.offsetWidth;
      var targetHeight = tooltipElement.offsetHeight;
      var offsetWidth = container.offsetWidth;
      var offsetHeight = container.offsetHeight;

      switch (direction) {
        case 'top':
          arrow.setAttribute('class', 'arrow top');
          position= {
            top: targetOffsetTop - offsetHeight,
            left: targetOffsetLeft + (targetWidth / 2) - offsetWidth / 2
          };
          break;
        case 'right':
          arrow.setAttribute('class', 'arrow right');
          position= {
            top: targetOffsetTop + (targetHeight / 2) - offsetHeight / 2,
            left: targetOffsetLeft + targetWidth
          };
          break;
        case 'bottom':
          arrow.setAttribute('class', 'arrow bottom');
          position= {
            top: targetOffsetTop + targetHeight,
            left: targetOffsetLeft + (targetWidth / 2) - offsetWidth / 2
          };
          break;
        case 'left':
          arrow.setAttribute('class', 'arrow left');
          position= {
            top: targetOffsetTop + (targetHeight / 2) - offsetHeight / 2,
            left: targetOffsetLeft - offsetWidth
          };
          break;
      }

      container.setAttribute('style', 'top:' + position.top + 'px;left:' + position.left + 'px;');
    }

    function handleTooltipBlur() {
      hide(container);
      arrow.setAttribute('class', 'arrow');
    }
  }

  return {
    apply: apply
  };
})();

window.addEventListener('load', function() {
  tooltipModule.apply('*');
}, false);
