/**
 * Quimm App main file
 */

(function( Backend, Act ){
  // TODO: acomodar las cosas - La idea es tomar a este modulo como un starter para los demas.
  Act.cargarMapa();

  Backend.iniciar();

  console.log('-- Quimm App: iniciada. --');

}( ConexionBackend, Actividad )); // Declaramos a nuestros otros modulos como dependencias.
