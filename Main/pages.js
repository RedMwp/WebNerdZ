//xhr function

function fetchAndRenderHTML(url, containerId) {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          document.getElementById(containerId).innerHTML = xhr.responseText;
        } else {
          console.error('Error fetching HTML:', xhr.statusText);
        }
      }
    };

    xhr.open('GET', url, true);
    xhr.send();
  }
//page fetching functions

function fetchSettings(){
fetchAndRenderHTML("pages/settings.html",'sf-main-content')
}
function fetchCourses() {
    fetchAndRenderHTML("pages/courses.html", 'sf-main-content')
}

function fetchShowcase() {
    fetchAndRenderHTML("pages/showcase.html", 'sf-main-content')
}


salw.init('sf-main-content');

// Define routes using the new format
salw.addRoute('/', {
    content: function() {
        fetchCourses()
    }
});

salw.addRoute('showcase', {
    content: function() {
        fetchShowcase()
    }
});

salw.addRoute('settings', {
    content: function() {
        fetchSettings();
    }
});

salw.addRoute('courses', {
    content: function() {
        fetchCourses()
    },
    transition: function() {
        console.log('Transition for the example page');
    }
});

// Set custom 404 page
salw.setCustom404(function() {
    document.getElementById('sf-main-content').innerHTML = `
        <h1>404 Not Found</h1>
        <p>Sorry, the page you're looking for does not exist.</p>
      `;
});

salw.navigateTo('/')
