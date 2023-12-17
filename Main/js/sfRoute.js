    const salw = {
      routes: {},
      notFoundCallback: null,
      transitionCallback: null,
      custom404Callback: null,
      currentRoute: '',
      contentElement: null,

      addRoute: function (path, routeOptions) {
        this.routes[path] = routeOptions;
      },

      setNotFound: function (callback) {
        this.notFoundCallback = callback;
      },

      setTransition: function (callback) {
        this.transitionCallback = callback;
      },

      setCustom404: function (callback) {
        this.custom404Callback = callback;
      },

      handleHashChange: function () {
        const newRoute = window.location.hash.substring(1);

        if (newRoute !== this.currentRoute) {
          const contentElement = this.contentElement;

          if (this.transitionCallback) {
            this.transitionCallback();
          }

          const self = this;

          // Start transition
          var startTime;
          function animate(time) {
            if (!startTime) startTime = time;
            const progress = time - startTime;
            const opacity = Math.min(1, progress / 1800); // Adjust duration as needed

            contentElement.style.opacity = opacity;

            if (progress < 500) {
              requestAnimationFrame(animate);
            } else {
              startTime = null;

              // Transition complete
              const route = self.routes[newRoute];

              if (route) {
                self.currentRoute = newRoute;
                if (route.transition) {
                  route.transition();
                }
                route.content();
              } else if (self.notFoundCallback) {
                self.notFoundCallback();
              } else if (self.custom404Callback) {
                self.custom404Callback();
              } else {
                console.error('Route not found, and no 404 page set!');
              }

              // Reset styles for next transition
              contentElement.style.opacity = '';
            }
          }

          // Initial call to start animation
          requestAnimationFrame(animate);
        }
      },

      navigateTo: function (path) {
        window.location.hash = path;
      },

      init: function (contentElementId) {
        this.contentElement = document.getElementById(contentElementId);

        if (!this.contentElement) {
          console.error('Content element not found!');
          return;
        }

        const self = this;

        window.addEventListener('DOMContentLoaded', function () {
          self.handleHashChange();
        });

        window.addEventListener('hashchange', function () {
          self.handleHashChange();
        });
      },
    }