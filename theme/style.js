var myTheme = {
    init: function () {
        // Common functions
        if (this.inIframe()) $('body').addClass('in-iframe');
        if (!$('body').hasClass('exe-web-site')) return;
        // Add menu and search bar togglers
        var togglers =
            '\
            <button type="button" id="siteNavToggler" class="toggler" title="' +
            $exe_i18n.menu +
            '">\
                <span class="sr-av">' +
            $exe_i18n.menu +
            '</span>\
            </button>\
            <button type="button" id="searchBarTogger" class="toggler" title="' +
            $exe_i18n.search +
            '">\
                <span class="sr-av">' +
            $exe_i18n.search +
            '</span>\
            </button>\
        ';
        $('#siteNav').before(togglers);
        // Check the current NAV status
        var url = window.location.href;
        url = url.split('?');
        if (url.length > 1) {
            if (url[1].indexOf('nav=false') != -1) {
                $('body').addClass('siteNav-off');
                myTheme.params('add');
            }
        }
        // Menu toggler
        $('#siteNavToggler').on('click', function () {
            if (myTheme.isLowRes()) {
                $('#exe-client-search').hide();
                if ($('body').hasClass('siteNav-off')) {
                    $('body').removeClass('siteNav-off');
                } else {
                    if ($('#siteNav').isInViewport()) {
                        $('body').addClass('siteNav-off');
                        myTheme.params('add');
                    }
                }
            } else {
                $('body').toggleClass('siteNav-off');
                myTheme.params(
                    $('body').hasClass('siteNav-off') ? 'add' : 'remove'
                );
            }
        });
        // Search bar toggler
        $('#searchBarTogger').on('click', function () {
            var bar = $('#exe-client-search');
            if (bar.is(':visible')) {
                bar.hide();
            } else {
                if (myTheme.isLowRes()) {
                    $('body').addClass('siteNav-off');
                }
                bar.show();
                $('#exe-client-search-text').focus();
            }
        });
        if (!this.inIframe()) {
            // Fixed navigation
            $('#siteNav').wrap('<div id="sidebar-nav"></div>');
            myTheme.checkNav();
            $(window).bind('resize', function () {
                myTheme.checkNav();
            });
        }
        // Search form
        this.searchForm();

        // mover .page-title dentro de .page-content
        this.movePageTitle();
    },
    inIframe: function () {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    },
    searchForm: function () {
        $('#exe-client-search-text').attr('class', 'form-control');
    },
    isLowRes: function () {
        return $('#siteNav').css('float') == 'none';
    },
    checkNav: function () {
        var wrapper = $('#sidebar-nav');
        var navH = $('#siteNav > ul').height(); // Menu height
        navH = navH + 50;
        if (navH < $(window).height()) wrapper.addClass('fixed');
        else wrapper.removeClass('fixed');
    },
    param: function (e, act) {
        if (act == 'add') {
            var ref = e.href;
            var con = '?';
            if (ref.indexOf('.html?') != -1) con = '&';
            var param = 'nav=false';
            if (ref.indexOf(param) == -1) {
                ref += con + param;
                e.href = ref;
            }
        } else {
            // This will remove all params
            var ref = e.href;
            ref = ref.split('?');
            e.href = ref[0];
        }
    },
    params: function (act) {
        $('.nav-buttons a').each(function () {
            myTheme.param(this, act);
        });
    },

    // function that move the h2 outside the header
    movePageTitle: function () {
        const tryMove = () => {
            const $header = $('.main-header .page-header');
            const $title = $header.find('.page-title').first();

            // Search container of content
            let $content = $('.page-content').first();
            if (!$content.length)
                $content = $('.content, main .content').first();
            if (!$content.length) $content = $('#main, #content').first();
            if (!$content.length && $header.length)
                $content = $header.nextAll(':not(header)').first();
            if (!$content.length && $header.length) $content = $header.parent();

            if ($header.length && $title.length && $content.length) {
                $content.prepend($title); // move it to the start
                return true;
            }
            return false;
        };

        if (tryMove()) return;

        const observer = new MutationObserver(() => {
            if (tryMove()) observer.disconnect();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    },
    // 🔼
};

$(function () {
    myTheme.init();
});

$.fn.isInViewport = function () {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();
    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();
    return elementBottom > viewportTop && elementTop < viewportBottom;
};

// ---------------------------------------------------------
    // REPARACIÓN LÁSER V3: El Radar de Movimiento (MutationObserver)
    // ---------------------------------------------------------
    $(function() {
        var mathjaxTimer = null;
        
        // Creamos un radar que vigila si aparecen elementos nuevos en pantalla
        var observer = new MutationObserver(function(mutations) {
            var necesitaMathJax = false;
            
            // Comprobamos si el juego ha inyectado texto nuevo (las respuestas)
            for (var i = 0; i < mutations.length; i++) {
                var añadidos = mutations[i].addedNodes;
                for (var j = 0; j < añadidos.length; j++) {
                    var nodo = añadidos[j];
                    
                    // Si es un nodo HTML normal (ignoramos los que crea el propio MathJax para no hacer bucle)
                    if (nodo.nodeType === 1) { 
                        var className = nodo.className || "";
                        var tagName = nodo.tagName || "";
                        if (typeof className === "string" && className.indexOf("MathJax") === -1 && tagName.indexOf("MJX") === -1) {
                            necesitaMathJax = true;
                            break;
                        }
                    } else if (nodo.nodeType === 3) { // O si es texto puro con fórmulas
                        if (nodo.nodeValue.indexOf('\\(') !== -1) {
                            necesitaMathJax = true;
                            break;
                        }
                    }
                }
                if (necesitaMathJax) break;
            }

            // Si el radar detecta las respuestas, mandamos a MathJax a traducir tras una breve pausa
            if (necesitaMathJax) {
                clearTimeout(mathjaxTimer);
                mathjaxTimer = setTimeout(function() {
                    if (typeof window.MathJax !== 'undefined') {
                        try {
                            if (window.MathJax.typesetPromise) {
                                window.MathJax.typesetPromise();
                            } else if (window.MathJax.Hub) {
                                window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub]);
                            }
                        } catch(e) {}
                    }
                }, 200); // 200 milisegundos de margen para que el juego termine de dibujar
            }
        });

        // Encendemos el radar apuntando al contenido de eXeLearning
        var objetivo = document.querySelector('.exe-content');
        if (objetivo) {
            observer.observe(objetivo, { childList: true, subtree: true });
        }
    });
	// =========================================
    // OPERACIÓN ILUSIÓN ÓPTICA (Imagen a Vídeo) - VERSIÓN CENTRADA
    // =========================================
    $(document).on('click', 'a.video-magico', function(e) {
        e.preventDefault(); // Detenemos el salto a otra página
        
        var urlVideo = $(this).attr('href');
        var $img = $(this).find('img');
        
        // Copiamos las dimensiones exactas de la imagen
        var ancho = $img.attr('width') || $img.width() || '100%';
        var alto = $img.attr('height') || $img.height() || '315';
        
        var $reproductor;

        // 1. YouTube (preparado para auto-reproducción)
        if (urlVideo.indexOf('youtube.com') !== -1 || urlVideo.indexOf('youtu.be') !== -1) {
            var videoId = "";
            if (urlVideo.indexOf('v=') !== -1) {
                videoId = urlVideo.split('v=')[1].split('&')[0];
            } else if (urlVideo.indexOf('youtu.be/') !== -1) {
                videoId = urlVideo.split('youtu.be/')[1].split('?')[0];
            }
            var urlEmbed = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0';
            $reproductor = $('<iframe width="' + ancho + '" height="' + alto + '" src="' + urlEmbed + '" frameborder="0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>');
        } 
        // 2. Archivos locales (.mp4) en modo "GIF Ninja" (sin controles, en bucle y silenciado)
        else if (urlVideo.indexOf('.mp4') !== -1) {
            $reproductor = $('<video width="' + ancho + '" height="' + alto + '" autoplay loop muted playsinline><source src="' + urlVideo + '" type="video/mp4"></video>');
        }
        // 3. Fallback genérico
        else {
            $reproductor = $('<iframe width="' + ancho + '" height="' + alto + '" src="' + urlVideo + '" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>');
        }

        // TÁCTICA DE CENTRADO: Forzamos al vídeo a quedarse en el medio
        $reproductor.css({
            'display': 'block',
            'margin': '0 auto',
            'max-width': '100%'
        });

        // Ejecutamos el cambiazo mágico
        $(this).replaceWith($reproductor);
    });
	// =========================================
    // RE-RENDERIZADO DE MATHJAX EN ELEMENTOS DINÁMICOS (Pestañas, Acordeones, etc.)
    // =========================================
    $(document).ready(function() {
        // Le damos un pequeño respiro de medio segundo a eXe para que termine de construir las pestañas
        setTimeout(function() {
            if (typeof MathJax !== 'undefined' && MathJax.typesetPromise) {
                // Obligamos a MathJax a dar una segunda pasada por toda la página
                MathJax.typesetPromise().then(function() {
                    console.log("MathJax ha revisado las pestañas con éxito.");
                });
            }
        }, 500); // 500 milisegundos de retraso táctico
    });
	// =========================================
    // INFILTRACIÓN IDEVICE ORDENA (Reparación de Tarjeta Final)
    // =========================================
    $(document).ready(function() {
        // Ejecutamos una vigilancia constante (cada medio segundo) por si aparece la tarjeta de victoria
        setInterval(function() {
            var $tarjetaVictoria = $('.ODNP-DivFeedback');
            
            // Si la tarjeta existe y está visible (no tiene display:none)
            if ($tarjetaVictoria.length > 0 && $tarjetaVictoria.css('display') !== 'none') {
                
                // Le forzamos el diseño bonito directamente al HTML para que no nos gane el CSS nativo
                $tarjetaVictoria.css({
                    'border-radius': '16px',
                    'border': '2px solid #e9ecef',
                    'box-shadow': '0 15px 40px rgba(0,0,0,0.15)',
                    'padding': '20px'
                });

                // Le ponemos un marquito a la copa de victoria
                $tarjetaVictoria.find('img').css({
                    'max-width': '90px',
                    'border-radius': '50%',
                    'border': '4px solid #d4edda',
                    'padding': '5px'
                });
            }
        }, 500); // Repetimos la vigilancia cada 500ms
    });