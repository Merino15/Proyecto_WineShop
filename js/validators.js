/**
 * Validador Oficial de DNI / NIE Español
 */
function validarDNI(dni) {
    dni = dni.toUpperCase().trim();
    const regex = /^[XYZ]?\d{7,8}[A-Z]$/;
    if (!regex.test(dni)) return false;

    const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
    let nie = dni;
    
    if (nie.startsWith('X')) nie = nie.replace('X', '0');
    else if (nie.startsWith('Y')) nie = nie.replace('Y', '1');
    else if (nie.startsWith('Z')) nie = nie.replace('Z', '2');

    const numero = parseInt(nie.substring(0, nie.length - 1), 10);
    const letraEsperada = letras[numero % 23];

    return dni.endsWith(letraEsperada);
}