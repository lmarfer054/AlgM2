$(function() {
    console.log("🔧 Iniciando reparación de botones eXe...");

    function repararBotones() {
        // Buscamos las cajas custom
        var $cajas = $('[class*="ejercicio-custom"]');
        
        $cajas.each(function() {
            var $caja = $(this);
            // Buscamos CUALQUIER input de tipo botón o submit dentro
            var $botones = $caja.find("input[type='button'], input[type='submit'], .feedbackbutton");
            
            $botones.each(function() {
                var $btn = $(this);
                // Si no tiene nuestro envoltorio, se lo ponemos
                if (!$btn.parent().hasClass("feedbackbutton-wrapper")) {
                    $btn.wrap("<div class='feedbackbutton-wrapper'></div>");
                    $btn.after("<span class='custom-text-overlay'>Mostrar solución</span>");
                }
            });
        });
    }

    // LISTENER DE CLIC MEJORADO
    // Detectamos clics en el wrapper o en el input interno
    $(document).on('click', '.feedbackbutton-wrapper, .feedbackbutton-wrapper input', function(e) {
        // Encontramos el elemento padre principal
        var $btnWrapper = $(this).closest('.feedbackbutton-wrapper');
        var $parent = $btnWrapper.closest('[class*="ejercicio-custom"]');
        
        if ($parent.length) {
            var $overlay = $btnWrapper.find('.custom-text-overlay');
            
            // Función para verificar estado
            var check = function() {
                // Buscamos cualquier caja de feedback visible
                var $box = $parent.find('.iDevice_answer, .iDevice_feedback, .feedback, [id^="feedback"]');
                
                // Comprobamos si alguna está visible y con opacidad > 0
                var isVisible = false;
                $box.each(function() {
                    if ($(this).is(':visible') && $(this).css('opacity') != 0 && $(this).css('display') != 'none') {
                        isVisible = true;
                    }
                });

                // Aplicamos clases
                $parent.toggleClass('solucion-abierta', isVisible);
                $overlay.text(isVisible ? "Ocultar solución" : "Mostrar solución");
            };

            // Chequeos en varios tiempos para pillar la animación de eXe
            setTimeout(check, 50);
            setTimeout(check, 300);
            setTimeout(check, 600);
        }
    });

    // Ejecutar inicio
    repararBotones();
    setTimeout(repararBotones, 1000);
});