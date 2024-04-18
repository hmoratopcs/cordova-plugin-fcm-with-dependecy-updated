#!/usr/bin/env node
'use strict';
/*
	Script para que al instalar el plugin, se añada la linea use_modular_headers! despues de la platform.
	La solución era intentar en el podspec del plugin hacer algo para que se añadiese lo de use_modular_headers!
	o bien añadir en plugin.xml el pod de "pod 'GoogleUtilities', :modular_headers => true" con la dependencia.
	No ha habido manera salvo este hook (con nombre fix_modular_headers.js), que debe añadirse en plugin.xml de la siguiente manera:
    <hook src="scripts/fix_modular_headers.js" type="before_plugin_install" />
 */
 
const fs = require('fs');
console.log("FIX use_modular_headers! - Ejecutando el script desde: " + process.cwd());
const podfilePath = 'platforms/ios/Podfile';
const lineToAdd = "use_modular_headers!";
fs.access(podfilePath, fs.constants.F_OK, (err) => {
    if (err) {
        console.error(`El archivo ${podfilePath} no existe o no se puede acceder.`);
        return;
    }
    fs.readFile(podfilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        if (data.includes(lineToAdd)) {
            return;
        }
        const lines = data.split('\n');
        let index = lines.findIndex(line => line.includes("platform"));
        if (index === -1) {
            console.error("No se encontró la declaración 'platform' en el Podfile.");
            return;
        }
        // Insertar la línea a añadir justo después
        lines.splice(index + 1, 0, lineToAdd).join('\n');
        const newData = lines.join('\n')
        fs.writeFile(podfilePath, newData, 'utf8', (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(`FIX use_modular_headers! - Se ha añadido la línea '${lineToAdd}' al Podfile correctamente.`);
        });
    });
});
