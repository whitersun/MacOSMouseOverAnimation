
function tabsBottomAnim (selector, options) {
    let dockContainer;
    if (typeof selector === 'object') {
        dockContainer = selector;
    } else if (typeof selector === 'string') {
        dockContainer = document.querySelector(selector);
    } else if (isArray(selector)) {
        if (selector.length > 1) {
            throw new Error('Just only one element is allowed');
        }

        dockContainer = selector[0];
    }

    const dockItems = dockContainer.querySelectorAll(':scope .dock-item');

    const defaults = {
        scale: 1,
        afterHoverScale: 1.5,
        afterNeighborScale: 1.1,
        margin: "5px",
        expanded: "12px",
    }

    const { scale, afterHoverScale, afterNeighborScale, margin, expanded } = Object.assign({}, defaults, options);

    const defaultItemScale = scale;
    const hoverItemScale = afterHoverScale;
    const neighborItemScale = afterNeighborScale;
    
    
    const defaultMargin = margin;
    const expandedMargin = expanded;

    
    dockItems.forEach(btn => {
        btn.addEventListener('click', function (e) {
            
            console.log(e);
            // const x = e.clientX - e.target.offsetLeft;
            // const y = e.clientY - e.target.offsetTop;
            const x = e.offsetX;
            const y = e.offsetY;
            
            const ripples = document.createElement('span');
            ripples.style.left = `${x}px`;
            ripples.style.top = `${y}px`;
            this.appendChild(ripples);
            
            setTimeout(() => {
                ripples.remove()
            }, 2000);
        });
    });
    
    const updateDockItems = () => {
        dockItems.forEach(item => {
            let scale = defaultItemScale;
            let margin = defaultMargin;
    
            if (item.isHovered) {
                scale = hoverItemScale;
                margin = expandedMargin;
            } else if (item.isNeighbor) {
                scale = neighborItemScale;
                margin = expandedMargin;
            }
    
            item.style.cssText = `
                transform: scale(${scale}); 
                margin: 0 ${margin};
            `;
        })
    };
    
    dockItems.forEach(item => {
        item.addEventListener('mousemove', () => {
            dockItems.forEach((otherItem) => {
                otherItem.isHovered = otherItem === item;
                otherItem.isNeighbor = 
                    Math.abs(
                        Array.from(dockItems).indexOf(otherItem) - 
                        Array.from(dockItems).indexOf(item)
                    ) === 1;
            });
    
            updateDockItems();
        })
    });
    
    dockContainer.addEventListener('mouseleave', () => {
        dockItems.forEach(item => {
            item.isHovered = item.isNeighbor = false;
        })
        
        updateDockItems();
    })
}
