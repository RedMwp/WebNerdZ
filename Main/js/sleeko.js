var Sleeko = {
    createElement: function(tagName, options) {
        var element = document.createElement(tagName);

        if (options) {
            if (options.attributes) {
                for (var key in options.attributes) {
                    if (options.attributes.hasOwnProperty(key)) {
                        element.setAttribute(key, options.attributes[key]);
                    }
                }
            }

            if (options.styles) {
                for (var property in options.styles) {
                    if (options.styles.hasOwnProperty(property)) {
                        element.style[property] = options.styles[property];
                    }
                }
            }

            if (options.content) {
                if (Array.isArray(options.content)) {
                    options.content.forEach(function (child) {
                        if (child instanceof HTMLElement) {
                            element.appendChild(child);
                        } else {
                            console.warn('Invalid content element:', child);
                        }
                    });
                } else if (options.content instanceof HTMLElement) {
                    element.appendChild(options.content);
                } else {
                    element.innerHTML = options.content;
                }
            }

            if (options.events) {
                for (var eventType in options.events) {
                    if (options.events.hasOwnProperty(eventType)) {
                        element.addEventListener(eventType, options.events[eventType]);
                    }
                }
            }
        }

        return element;
    },

    renderAppend: function(parentSelector, elements) {
        var parent = document.querySelector(parentSelector);

        if (parent) {
            if (Array.isArray(elements)) {
                elements.forEach(function (element) {
                    parent.appendChild(element);
                });
            } else {
                parent.appendChild(elements);
            }
        } else {
            console.error('Parent element not found:', parentSelector);
        }
    },

    renderReplace: function(parentSelector, elements) {
        var parent = document.querySelector(parentSelector);

        if (parent) {
            // Clear existing content before replacing
            parent.innerHTML = '';

            if (Array.isArray(elements)) {
                elements.forEach(function (element) {
                    parent.appendChild(element);
                });
            } else {
                parent.appendChild(elements);
            }
        } else {
            console.error('Parent element not found:', parentSelector);
        }
    },

    cloneNode: function(element) {
        return element.cloneNode(true);
    },

    createState: function(initialState) {
        var state = initialState || {};

        return {
            getState: function() {
                return state;
            },
            setState: function(newState) {
                state = Object.assign({}, state, newState);
                // Trigger a re-render or any other necessary actions here
            }
        };
    },

    createRouter: function(routes, notFoundRoute) {
        var currentRoute = '';

        function handleRouteChange() {
            var hash = window.location.hash.slice(1) || '/';
            var route = routes[hash];

            if (!route) {
                handleNotFound();
                return;
            }

            currentRoute = hash;
            route.render(route.targetSelector, route.content);
        }

        function handleLinkClick(event) {
            event.preventDefault();
            var targetRoute = event.target.getAttribute('data-route');

            if (targetRoute) {
                myRouter.navigate(targetRoute);
            }
        }

        function handleNotFound() {
            if (notFoundRoute) {
                notFoundRoute.render(notFoundRoute.targetSelector, notFoundRoute.content);
            } else {
                console.error('404: Page not found');
            }
        }

        window.addEventListener('hashchange', handleRouteChange);
        window.addEventListener('load', handleRouteChange); // Handle page refresh
        document.addEventListener('click', handleLinkClick);

        return {
            navigate: function (route) {
                window.location.hash = route;
            },
            getCurrentRoute: function () {
                return currentRoute;
            }
        };
    },

    createUrlRouter: function(routes, notFoundRoute) {
        function handleUrlChange() {
            var path = window.location.pathname;
            var routeFunction = routes[path];

            if (routeFunction) {
                routeFunction();
            } else {
                handleNotFound();
            }
        }

        function navigate(path) {
            window.history.pushState(null, null, path);
            handleUrlChange();
        }

        function handleNotFound() {
            if (notFoundRoute) {
                notFoundRoute.render(notFoundRoute.targetSelector, notFoundRoute.content);
            } else {
                console.error('404: Page not found');
            }
        }

        window.addEventListener('popstate', handleUrlChange);
        window.addEventListener('load', handleUrlChange); // Handle page refresh

        return {
            handleUrlChange: handleUrlChange,
            navigate: navigate
        };
    }
};
